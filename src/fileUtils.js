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
    // FIXME: Try/catch logic
    let [key, value] = currLine.split(":").trim();
    switch (key.toLowerCase()) {
      case "name":
        name = value;
        break;
      case "width":
        width = parseInt(value, 10);
        break;
      case "height":
        height = parseInt(value, 10);
        break;
      case "output size":
        outputSize = parseInt(value, 10);
        break;
    }
  }
  // fixme: validate look for nan missing etc
  for (; currLine < lines.length; currLine++) {
    if (lines[currLine].length === 0) {
      currLine++;
      break;
    }
    data += lines[currLine] + "\n";
  }

  // Translations...
  for (; currLine < lines.length; currLine++) {
    // FIXME: error checking try/catch
    let [key, value] = lines[currLine].split(":");
    value = value.substr(1);
    translations[key] = value;
  }

  return { name, width, height, outputSize, data, translations };
}

export const knownExportTypes = ["bin", "js", "c", "csv"];
export function exportAs(exportType, { name, width, height, outputSize, data, translations }) {}
