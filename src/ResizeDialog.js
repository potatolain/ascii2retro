import { useState } from "react";
export default function ResizeDialog({ width, height, onOk, onClose }) {
  const [newWidth, setNewWidth] = useState(width);
  const [newHeight, setNewHeight] = useState(height);

  function doCancel() {
    if (onClose) {
      onClose();
    }
  }
  function doOk() {
    if (onOk) {
      onOk(newWidth, newHeight);
    }
    if (onClose) {
      onClose();
    }
  }

  return (
    <dialog open={true}>
      <article>
        <header>
          <button aria-label="Close" rel="prev" onClick={doCancel}></button>
          <p>
            <strong>Are you sure?</strong>
          </p>
        </header>
        <p>Resizing your image will cause anything cropped off the page to disappear - this cannot be undone! </p>
        <p>Make sure to save before resizing if you're worried about losing data.</p>
        <fieldset role="group">
          <label htmlFor="pwidth">Width </label>
          <input
            id="pwidth"
            type="number"
            placeholder="Width"
            onChange={(e) => setNewWidth(e.target.value)}
            value={newWidth}
          />
        </fieldset>
        <fieldset role="group">
          <label htmlFor="pheight">Height </label>
          <input
            id="pheight"
            type="number"
            placeholder="Height"
            onChange={(e) => setNewHeight(e.target.value)}
            value={newHeight}
          />
        </fieldset>
        <footer>
          <button className="secondary" onClick={doCancel}>
            Cancel
          </button>
          <button onClick={doOk}>Ok</button>
        </footer>
      </article>
    </dialog>
  );
}
