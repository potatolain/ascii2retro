import vm from "vm";

// HACK: Our version of jest has a bug that prevents exposing structuredClone.
// Rather than spend an afternoon updating for this small app, here's a little workaround.
// Imperfect and has its quirks, but this should suffice for our purposes.
export function structuredClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function parseCommonJSFromString(codeText) {
  // Create a mock module object to capture exports
  const sandbox = {
    module: { exports: {} },
    exports: {},
  };

  // Tie them together just like Node.js does internally
  sandbox.exports = sandbox.module.exports;

  // Run the raw text script in the sandbox context
  vm.runInNewContext(codeText, sandbox);

  return sandbox.module.exports;
}
