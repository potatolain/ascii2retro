import { EXTRA_CHAR_TABLE } from "./constants.js";

export default function ExtraCharacterTable({ setActiveDrawCharacter, visible }) {
  return (
    <div className="extra-char-table" style={{ display: visible ? "block" : "none" }}>
      {EXTRA_CHAR_TABLE.map((c) => (
        <div key={c} className="char" onClick={() => setActiveDrawCharacter(c)}>
          {c}
        </div>
      ))}
    </div>
  );
}
