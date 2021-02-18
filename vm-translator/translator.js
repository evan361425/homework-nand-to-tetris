const { MemorySegment } = require('./memory-segment');
const { Logic } = require('./actions/logic');
const { Arithmetic } = require('./actions/arithmetic');
const { Bitwise } = require('./actions/bitwise');

/* eslint-disable no-multi-spaces */
const PREFIX_MEMORY_SEGMENT = ['push', 'pop'];
const PREFIX_LOGIC          = ['eq', 'lt', 'gt'];
const PREFIX_ARITHMETIC     = ['add', 'sub', 'and', 'or'];
const PREFIX_BITWISE        = ['neg', 'not'];
/* eslint-enable no-multi-spaces */

module.exports = class Translator {
  static translate(line) {
    const parts = line.split(' ');
    const action = parts[0];

    if (PREFIX_MEMORY_SEGMENT.includes(action)) {
      const { 1: segment, 2: index } = parts;
      const ms = new MemorySegment(segment);

      return ms[action](index).output();
    }

    if (PREFIX_LOGIC.includes(action)) {
      return Logic[action]().output();
    }

    if (PREFIX_ARITHMETIC.includes(action)) {
      return Arithmetic[action]().output();
    }

    if (PREFIX_BITWISE.includes(action)) {
      return Bitwise[action]().output();
    }

    throw Error(`Action ${action} is not allow`);
  }
};
