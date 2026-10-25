import { useState, useEffect } from "react";
import Character from "./Character.js";
import ToolSelector from "./ToolSelector.js";
import useLocalStorageState from "./useLocalStorageState.js";
import {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  CHAR_SIZE_W_BORDER_PX_X,
  CHAR_SIZE_W_BORDER_PX_Y,
  TOOL_TYPES,
  BOX_STYLES,
} from "./constants.js";

function buildDefaultData() {
  const data = [];
  for (let i = 0; i < DEFAULT_HEIGHT; i++) {
    data.push([]);
    for (let j = 0; j < DEFAULT_WIDTH; j++) {
      data[i].push(" ");
    }
  }
  return data;
}

function getCharacterPosition(event) {
  const editorRect = event.target.closest(".editor-wrap").getBoundingClientRect(),
    eventX = event.clientX - editorRect.left - 4,
    eventY = event.clientY - editorRect.top - 4,
    charX = Math.floor(eventX / CHAR_SIZE_W_BORDER_PX_X),
    charY = Math.floor(eventY / CHAR_SIZE_W_BORDER_PX_Y);

  return { eventX, eventY, charX, charY };
}

function drawBox(data, boxStyle, x1, y1, x2, y2) {
  const box = BOX_STYLES[boxStyle],
    minX = Math.min(x1, x2),
    maxX = Math.max(x1, x2),
    minY = Math.min(y1, y2),
    maxY = Math.max(y1, y2);

  return data.map((row, rowId) => {
    return row.map((col, colId) => {
      if (rowId === minY && colId === minX) {
        return box.tl;
      } else if (rowId == minY && colId === maxX) {
        return box.tr;
      } else if (rowId === maxY && colId === minX) {
        return box.bl;
      } else if (rowId === maxY && colId === maxX) {
        return box.br;
      } else if ((rowId === minY || rowId === maxY) && colId >= minX && colId <= maxX) {
        return box.horz;
      } else if ((colId === minX || colId === maxX) && rowId >= minY && rowId <= maxY) {
        return box.vert;
      }

      return col;
    });
  });
}

/* 
FIXME: Required features for use
* store/load localstorage
* resizing works
* exporting
* the replacement table below
* implement all tools
* copy/paste?
* undo/redo?
* Fill tool?
*/

// Rebuild the array backing ascii, warning if data will be lost
// FIXME: MUST build this warning piece somehow before launch
function rebuildArray(arr, width, height) {}

export default function Main() {
  const [name, setName] = useLocalStorageState("");
  const [width, setWidth] = useLocalStorageState("height", DEFAULT_WIDTH);
  const [height, setHeight] = useLocalStorageState("height", DEFAULT_HEIGHT);
  const [data, setData] = useLocalStorageState("drawingdata", buildDefaultData());
  const [activeTool, setActiveTool] = useLocalStorageState("activeTool", TOOL_TYPES[0]);
  const [activeTileX, setActiveTileX] = useState(null);
  const [activeTileY, setActiveTileY] = useState(null);
  const [boxPosTLXY, setboxPosTLXY] = useState(null);
  const [activeDrawCharacter, setActiveDrawCharacter] = useState("x");
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const [boxStyle, setBoxStyle] = useState("Default");

  useEffect(() => {
    window.addEventListener("mouseup", onReleaseEditor);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mouseup", onReleaseEditor);
      window.removeEventListener("keydown", onKeyDown);
    };
  });

  function writeCharacter(x, y, character) {
    const data2 = structuredClone(data);
    data2[y][x] = character;
    setData(data2);
  }

  function doEditorAction(event) {
    if (!event.target) {
      return;
    }

    const { charX, charY } = getCharacterPosition(event);

    if (charX < 0 || charX >= width || charY < 0 || charY >= height) {
      // out of bounds
      return;
    }
    // Right click, just always grab the tile and exit.
    if (event.button === 2) {
      setActiveDrawCharacter(data[charY][charX]);
      event.preventDefault();
      return;
    }

    switch (activeTool) {
      case "draw":
        if (event.button === 0) {
          writeCharacter(charX, charY, activeDrawCharacter);
        }
        break;
      case "text":
      case "box":
        setActiveTileX(charX);
        setActiveTileY(charY);
        break;
    }
  }

  function onClickEditor(event) {
    if (event.button === 0) {
      setMouseIsDown(true);
    }
    if (activeTool === "box") {
      const { charX, charY } = getCharacterPosition(event);
      setboxPosTLXY([charX, charY]);
      setActiveTileX(charX);
      setActiveTileY(charY);
      return;
    }
    doEditorAction(event);
  }

  function onReleaseEditor(event) {
    setMouseIsDown(false);
    if (boxPosTLXY) {
      setData(
        drawBox(
          data,
          BOX_STYLES.findIndex((b) => b.name === boxStyle),
          activeTileX,
          activeTileY,
          boxPosTLXY[0],
          boxPosTLXY[1],
        ),
      );
      setboxPosTLXY(null);
    }
  }

  function onKeyDown(event) {
    switch (activeTool) {
      case "draw":
        if (event.key.length === 1) {
          setActiveDrawCharacter(event.key);
          event.preventDefault();
        }
        break;
      case "text":
        if (event.key.length === 1) {
          writeCharacter(activeTileX, activeTileY, event.key);
          event.preventDefault();
          if (activeTileX + 1 < width) {
            setActiveTileX(activeTileX + 1);
          } else if (activeTileY < height) {
            setActiveTileX(0);
            setActiveTileY(activeTileY + 1);
          }
        } else {
          switch (event.key) {
            case "Backspace":
              if (activeTileX > 0) {
                writeCharacter(activeTileX - 1, activeTileY, " ");
                setActiveTileX(activeTileX - 1);
              } else if (activeTileY > 0) {
                writeCharacter(width - 1, activeTileY - 1, " ");
                setActiveTileX(width - 1);
                setActiveTileY(activeTileY - 1);
              }
              break;
            case "ArrowLeft":
              if (activeTileX > 0) {
                setActiveTileX(activeTileX - 1);
              }
              break;
            case "ArrowRight":
              if (activeTileX < width) {
                setActiveTileX(activeTileX + 1);
              }
              break;
            case "ArrowUp":
              if (activeTileY > 0) {
                setActiveTileY(activeTileY - 1);
              }
              break;
            case "ArrowDown":
              if (activeTileY < height) {
                setActiveTileY(activeTileY + 1);
              }
              break;
            default:
              // unhandled. SKIP the preventDefault by returning
              return;
          }
          event.preventDefault();
        }
    }
  }

  return (
    <>
      <div className="container">
        <h1>ascii2retro</h1>
        <div className="project-description">
          A little tool to help you create graphics for your retro and retro-styled games in the simplest way possible!
          Draw something with text, then create binary. Or, use the generated text to convert it yourself using our
          tools!
        </div>
        <fieldset role="group">
          <label htmlFor="pname">Project name </label>
          <input id="pname" type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} value={name} />
        </fieldset>
        <fieldset role="group">
          <label htmlFor="pwidth">Width </label>
          <input
            id="pwidth"
            type="number"
            placeholder="Width"
            onChange={(e) => setWidth(e.target.value)}
            value={width}
          />
        </fieldset>
        <fieldset role="group">
          <label htmlFor="pheight">Height </label>
          <input
            id="pheight"
            type="number"
            placeholder="Height"
            onChange={(e) => setHeight(e.target.value)}
            value={height}
          />
        </fieldset>
      </div>
      <div className="container-fluid editor-container">
        <article className="tools card">
          <h3>Tools</h3>
          <ToolSelector
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            activeDrawCharacter={activeDrawCharacter}
            setActiveDrawCharacter={setActiveDrawCharacter}
            boxStyle={boxStyle}
            setBoxStyle={setBoxStyle}
          />
        </article>
        <article className="editor">
          <div
            className="editor-wrap"
            onMouseDown={onClickEditor}
            onContextMenu={(e) => e.preventDefault()}
            onMouseMove={(e) => (mouseIsDown ? doEditorAction(e) : null)}
          >
            {/* TODO: This isn't exactly efficient... */}
            {data.map((row, rowId) => (
              <div key={rowId} className="row">
                {row.map((chr, chrId) => {
                  // TODO does this class provide value?
                  let isActive = false;
                  if (activeTool === "text") isActive = rowId === activeTileY && chrId === activeTileX;
                  if (activeTool === "box" && boxPosTLXY) {
                    const minX = Math.min(boxPosTLXY[0], activeTileX),
                      maxX = Math.max(boxPosTLXY[0], activeTileX),
                      minY = Math.min(boxPosTLXY[1], activeTileY),
                      maxY = Math.max(boxPosTLXY[1], activeTileY);

                    isActive =
                      ((rowId === minY || rowId === maxY) && chrId >= minX && chrId <= maxX) ||
                      ((chrId === minX || chrId === maxX) && rowId >= minY && rowId <= maxY);
                  }
                  return <Character key={chrId} value={chr} isActive={isActive} />;
                })}
              </div>
            ))}
          </div>
          <button className="square">XD</button>
        </article>
      </div>
    </>
  );
}
