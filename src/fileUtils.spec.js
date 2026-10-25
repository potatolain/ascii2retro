import { saveToText, loadFromText } from "./fileUtils";
import { describe, it, expect } from "@jest/globals";
import { structuredClone } from "./test-utils";

const face = `xxxxxxxx
xxxxxxxx
xoxxxxox
xxxxxxxx
xoxxxxox
xoooooox
xxxxxxxx
xxxxxxxx`
  // Finagle into the format the app uses, array of arrays
  .split("\n")
  .map((r) => r.split(""));

const faceObj = {
  name: "Smiley Face",
  width: 8,
  height: 8,
  outputSize: "byte",
  data: face,
  translations: { " ": 0, x: 1, o: 2 },
};

const faceData = `Name: Smiley Face
Width: 8
Height: 8
Output Size: byte

xxxxxxxx
xxxxxxxx
xoxxxxox
xxxxxxxx
xoxxxxox
xoooooox
xxxxxxxx
xxxxxxxx

 : 0
x: 1
o: 2`;

const faceDataNoTranslationTable = `Name: Smiley Face
Width: 8
Height: 8
Output Size: byte

xxxxxxxx
xxxxxxxx
xoxxxxox
xxxxxxxx
xoxxxxox
xoooooox
xxxxxxxx
xxxxxxxx

`;
describe("saveToText", () => {
  it("does a basic export correctly", () => {
    expect(saveToText(faceObj)).toEqual(faceData);
  });

  it("Fails on empty", () => {
    expect(() => saveToText({})).toThrow(/Missing required parameters/);
  });
  it("Fails on missing width or height", () => {
    const obj = structuredClone(faceObj);
    delete obj.width;
    expect(() => saveToText(obj)).toThrow(/Missing required parameters/);
    const obj2 = structuredClone(faceObj);
    delete obj2.height;
    expect(() => saveToText(obj2)).toThrow(/Missing required parameters/);
  });
  it("Fails on missing outputSize", () => {
    const obj = structuredClone(faceObj);
    delete obj.outputSize;
    expect(() => saveToText(obj)).toThrow(/Missing required parameters/);
  });
  it("Fails on missing data", () => {
    const obj = structuredClone(faceObj);
    obj.data = "no";
    expect(() => saveToText(obj)).toThrow(/Data missing/);
  });
  it("Handles empty translation table", () => {
    const obj = structuredClone(faceObj);
    delete obj.translations;
    expect(saveToText(obj)).toEqual(faceDataNoTranslationTable);
  });
});
