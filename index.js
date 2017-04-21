'use strict';
/* eslint-disable no-console */
const native = require('assert');
const YAML = require('yamljs');

console.log('TAP version 13');

let tests = 0;
let passes = 0;
let failures = 0;

function printError(err) {
  const message = {
    name: err.name,
    message: err.message,
    stack: err.stack.split('\n'),
  };
  console.log('  ---');
  console.log(YAML.stringify(message, 4).replace(/^/gm, '  '));
  console.log('  ...');
}

function test(message, fn) {
  return (() => {
    const args = Array.prototype.slice.call(arguments);
    tests++;
    try {
      fn.apply(native, [args]);
      console.log(`ok ${tests} ${message || ''}`);
      passes++;
    } catch (err) {
      console.log(`not ok ${tests} ${message || ''}`);
      failures++;
      printError(err);
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

assert.ifError = (value) => {
  test('', () => native.ifError(value));
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

process.on('uncaughtException', (err) => {
  console.log(`Bail out! Uncaught exception ${err.name}`);
  printError(err);
  process.exit(1);
});

process.on('exit', (code) => {
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
