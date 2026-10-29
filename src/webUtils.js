export function downloadFile(fileName, contentType, content) {
  const blob = new Blob([content], { type: contentType }),
    url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = fileName; // The file name browser defaults to

  document.body.appendChild(a);
  a.click();

  URL.revokeObjectURL(url);
  a.remove();
}
