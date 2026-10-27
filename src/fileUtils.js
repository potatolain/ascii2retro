// Super simple version of the format...
// meta information
// double newline signifies end
// content, including spaces, no whitespace around
// double newline, no other whitespace signifies end
// translation table, unicode -> value

/**
 * Save the data
 * @param {object} AsciiData
 * // FIXME document params
 * @returns Raw text which can be saved to a txt file representing this art.  Can be imported later.
 */
export function saveToText({ name, width, height, outputSize, data, translations }) {
  if (!width || !height || !outputSize) {
    throw new Error("Missing required parameters! Need width, height and outputSize.");
  }
  if (!data || data.length < 3) {
    throw new Error("Data missing or invalid! Cannot save!");
  }
  if (!translations) {
    translations = {};
  }

  const strData = data.map((row) => row.join("")).join("\n");

  let txt = `Name: ${name}
Width: ${width}
Height: ${height}
Output Size: ${outputSize}

${strData}

${Object.keys(translations)
  .map((k) => `${k}: ${translations[k]}`)
  .join("\n")}`;

  return txt;
}

export function loadFromText(txt) {
  const lines = txt.split("\n");
  let currLine = 0,
    name,
    width,
    height,
    outputSize,
    data = "",
    translations = {};

  for (currLine = 0; currLine < lines.length; currLine++) {
    // NOTE: Empty line means section end, start of data
    if (lines[currLine].length === 0) {
      currLine++;
      break;
    }
    const splut = lines[currLine].split(":");
    let [key, value] = splut.map((l) => l.trim());
    if (splut.length != 2) {
      throw new Error("Parameters section is corrupted! Cannot import.");
    }
    switch (key.toLowerCase()) {
      case "name":
        // FIXME: Edge case, name has a colon. Handle or restrict. Quotes too... maybe we need to restrict.
        name = value;
        break;
      case "width":
        width = parseInt(value, 10);
        if (isNaN(width)) {
          throw new Error(`Failed parsing key "Width"! It must be a number, received: "${value}"`);
        }
        break;
      case "height":
        height = parseInt(value, 10);
        if (isNaN(height)) {
          throw new Error(`Failed parsing key "Height"! It must be a number, received: "${value}"`);
        }
        break;
      case "output size":
        outputSize = parseInt(value, 10);
        if (isNaN(outputSize)) {
          throw new Error(`Failed parsing key "Output Size"! It must be a number, received: "${value}"`);
        }

        break;
    }
  }
  if (!width || !height) {
    throw new Error("Width or height not provided! Cannot import.");
  }
  if (!outputSize) {
    throw new Error("Output Size not provided! Cannot import.");
  }
  for (; currLine < lines.length; currLine++) {
    if (lines[currLine].length === 0) {
      currLine++;
      break;
    }
    data += lines[currLine] + "\n";
  }

  // Translations...
  for (; currLine < lines.length; currLine++) {
    // Skip blank lines
    if (lines[currLine].length === 0) {
      continue;
    }
    const splut = lines[currLine].split(":");
    let [key, value] = splut;
    if (splut.length != 2) {
      throw new Error("Translations section is corrupted! Cannot import.");
    }
    value = value.substr(1);
    translations[key] = value;
  }

  return { name, width, height, outputSize, data, translations };
}

// Take translations and turn the values into values we can put into the output file.
function parseTranslations(translations, outputSize) {
  return Object.fromEntries(
    Object.entries(translations).map(([key, value]) => {
      if (outputSize === 64) {
        value = BigInt(value);
      } else if (value.startsWith("0x")) {
        value = parseInt(value.substr(2), 16);
      } else if (value.startsWith("$")) {
        value = parseInt(value.substr(1), 16);
      } else if (value.startsWith("0b")) {
        value = parseInt(value.substr(2), 2);
      } else if (value.startsWith("%")) {
        value = parseInt(value.substr(1), 16);
      } else if (Number.isInteger(outputSize)) {
        value = parseInt(value);
      }
      return [key, value];
    }),
  );
}

function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export const knownExportTypes = ["bin", "js", "json", "c", "csv"];
// Turns the given data into the given format. Does not create a file, just serves up the content.
export function exportAs(exportType, { name, width, height, outputSize, data, translations }) {
  const parsedTranslations = parseTranslations(translations, outputSize),
    rawData = [];
  data.forEach((row, rowId) => {
    row.forEach((col, colId) => {
      rawData.push(parsedTranslations[col] ?? col);
    });
  });

  switch (exportType) {
    case "bin":
      switch (outputSize) {
        case 16:
          return new Uint16Array(rawData);

        case 32:
          return new Uint32Array(rawData);
        case 64:
          return new BigUint64Array(rawData);
        case 8:
        default:
          return new Uint8Array(rawData);
      }
    case "js":
      const rawDataSplit = chunkArray(rawData, 16)
        .map((a) => a.join(" ,"))
        .join(",\n    ");
      return `module.exports = { 
    name: "${name}",
    width: ${width}, 
    height: ${height}, 
    outputSize: ${outputSize}, 
    data: ${outputSize === 64 ? `new BigUint64Array([${rawData.map((m) => `BigInt('${m}')`).join(", ")}])` : `[${rawData.join(", ")}]`}
}`;
    case "json":
      if (outputSize === 64) {
        throw new Error(
          "64 bit json exports are not supported due to limitations of the json format. Please use JS or another format",
        );
      }
      return `{ 
    "name": "${name}",
    "width": ${width}, 
    "height": ${height}, 
    "outputSize": ${outputSize}, 
    "data": [${chunkArray(rawData, 16)
      .map((a) => a.join(", "))
      .join(",\n    ")}]
}
`;
    case "c":
      return `#define ART_WIDTH ${width}
#define ART_HEIGHT ${height}
#define OUTPUT_SIZE ${outputSize}
const unsigned char artData[] = {
    ${chunkArray(rawData, 16)
      .map((n) => n.join(", "))
      .join(",\n    ")};
};`;
    case "csv":
      return rawData.join(",");
    default:
      throw new Error("Unknown export type! Available types: " + knownExportTypes.join(", "));
  }
}
