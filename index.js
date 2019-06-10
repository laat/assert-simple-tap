"use strict";

/* eslint-disable no-console */
const native = require("assert");
const tapYaml = require("tap-yaml");
const StackUtils = require("stack-utils");

console.log("TAP version 13");

let tests = 0;
let passes = 0;
let failures = 0;
const stackUtils = new StackUtils({
  internals: [...StackUtils.nodeInternals(), /\/assert-simple-tap\/index.js/]
});

function printObject(obj) {
  console.log("  ---");
  console.log(tapYaml.stringify(obj, 4).replace(/^/gm, "  "));
  console.log("  ...");
}

function test(message, fn) {
  return (() => {
    const args = Array.prototype.slice.call(arguments);
    tests++;
    try {
      fn.apply(native, [args]);
      console.log(`ok ${tests} ${message || ""}`);
      passes++;
    } catch (err) {
      console.log(`not ok ${tests} ${message || ""}`);
      failures++;
      if ("actual" in err && "expected" in err && "operator" in err) {
        printObject({
          operator: err.operator,
          actual: err.actual,
          expected: err.expected,
          at: stackUtils
            .clean(err.stack)
            .split("\n")
            .filter((x, i) => x !== "}")
            .join("\n")
        });
      } else {
        printObject(err);
      }
    }
  })();
}

const assert = (value, message) => test(message, () => native(value, message));

assert.deepEqual = (actual, expected, message) => {
  test(message, () => native.deepEqual(actual, expected, message));
};

assert.deepStrictEqual = (actual, expected, message) => {
  test(message, () => native.deepStrictEqual(actual, expected, message));
};

assert.doesNotThrow = (block, error, message) => {
  test(message, () => native.doesNotThrow(block, error, message));
};

assert.equal = (actual, expected, message) => {
  test(message, () => native.equal(actual, expected, message));
};

assert.fail = (actual, expected, message, operator) => {
  test(message, () => native.fail(actual, expected, message, operator));
};

assert.ifError = value => {
  test("", () => native.ifError(value));
};

assert.notDeepEqual = (actual, expected, message) => {
  test(message, () => native.notDeepEqual(actual, expected, message));
};

assert.notDeepStrictEqual = (actual, expected, message) => {
  test(message, () => native.notDeepStrictEqual(actual, expected, message));
};

assert.ok = (value, message) => {
  test(message, () => native.ok(value, message));
};

assert.throws = (block, error, message) => {
  test(message, () => native.throws(block, error, message));
};

process.on("uncaughtException", err => {
  console.log(`Bail out! Uncaught exception ${err.name}`);
  printObject(err);
  process.exit(1);
});

process.on("exit", code => {
  if (code === 0) {
    console.log(`1..${tests}`);
    console.log(`# tests ${tests}`);
    console.log(`# pass ${passes}`);
    console.log(`# fail ${failures}`);
    if (failures > 0) {
      process.reallyExit(1);
    }
  }
});

module.exports = assert;
