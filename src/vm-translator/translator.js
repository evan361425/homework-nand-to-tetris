import { Arithmetic } from './actions/arithmetic.js';
import { Bitwise } from './actions/bitwise.js';
import { Flow } from './actions/flow.js';
import { Function } from './actions/function.js';
import { Logic } from './actions/logic.js';
import { MemorySegment } from './memory-segment.js';

const PREFIX_MEMORY_SEGMENT = ['push', 'pop'];
const PREFIX_LOGIC = ['eq', 'lt', 'gt'];
const PREFIX_ARITHMETIC = ['add', 'sub', 'and', 'or'];
const PREFIX_BITWISE = ['neg', 'not'];
const PREFIX_FLOW = ['label', 'goto', 'if-goto'];
const PREFIX_FUNCTION = ['function', 'call', 'return'];

export class Translator {
  /**
   * @param {string} line
   * @return {string}
   */
  static translate(line) {
    const parts = line.split(' ');
    let action = parts[0];

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

    if (PREFIX_FLOW.includes(action)) {
      if (!parts[1]) throw Error(`Wrong format on FLOW(${action})`);
      if (action === 'if-goto') action = 'ifGoto';

      return Flow[action](parts[1]).output();
    }

    if (PREFIX_FUNCTION.includes(action)) {
      return Function[action](parts[1], parseInt(parts[2], 10)).output();
    }

    throw Error(`Action ${action} is not allow`);
  }
}
