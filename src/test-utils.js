// HACK: Our version of jest has a bug that prevents exposing structuredClone.
// Rather than spend an afternoon updating for this small app, here's a little workaround.
// Imperfect and has its quirks, but this should suffice for our purposes.
export function structuredClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
