import { useState } from "react";
export default function InfoDialog({ title, content, onOk, onCancel, onClose }) {
  const [isVisibleInternal, setIsVisibleInternal] = useState(false);
  const [currentDialogHash, setCurrentDialogHash] = useState("");
  const newDialogHash = (title ?? "") + (content ?? "");

  if (currentDialogHash !== newDialogHash) {
    setCurrentDialogHash(newDialogHash);
    setIsVisibleInternal(title && content);
  }

  function doCancel() {
    if (onCancel) {
      onCancel();
    }

    setIsVisibleInternal(false);
    if (onClose) {
      onClose();
    }
  }
  function doOk() {
    if (onOk) {
      onOk();
    }
    setIsVisibleInternal(false);
    if (onClose) {
      onClose();
    }
  }

  const defaultButtons = (
    <>
      <button className="secondary" onClick={doCancel}>
        Cancel
      </button>
      <button onClick={doOk}>Ok</button>
    </>
  );
  return (
    <dialog open={isVisibleInternal}>
      <article>
        <header>
          <button aria-label="Close" rel="prev" onClick={doCancel}></button>
          <p>
            <strong>{title}</strong>
          </p>
        </header>
        {content}
        <footer>{defaultButtons}</footer>
      </article>
    </dialog>
  );
}
