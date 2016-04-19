import assert from './assert';

assert(true, 'assert');
assert.deepEqual(1, 1, 'deepEqual');
assert.deepStrictEqual(1, 1, 'deepStrictEqual');
assert.doesNotThrow(() => ({}), Error, 'doesNotThrow');
assert.equal(1, 1, 'equal');

// assert.fail()
// assert.ifError()

assert.notDeepEqual(1, 2, 'notDeepEqual');
assert.notDeepStrictEqual(1, 2, 'notDeepStrictEqual');
assert.ok(true, 'ok');
assert.throws(() => {
  throw new Error('throws');
}, Error, 'throws');
