const Ram = require('./ram');
const Logic = require('./logic');

module.exports = class Translator {
  static translate(line) {
    const parts = line.split(' ');
    switch (parts.length) {
    case 3:
      return this.memory(...parts);
    case 1:
      return this.logic(parts[0]);
    default:
      throw Error('VM code is in wrong format');
    }
  }

  static memory(action, segment, index) {
    const ram = new Ram(segment);

    switch (action) {
    case 'push':
    case 'pop':
      return ram[action](index);
    default:
      throw Error('Memory segment action must only be "push" or "pop"');
    }
  }

  static logic(action) {
    switch (action) {
    // math
    case 'add':
    case 'sub':
    case 'and':
    case 'or':
    // logic
    case 'eq':
    case 'lt':
    case 'gt':
    // bitwise
    case 'neg':
    case 'not':
      return Logic[action]().output();
    default:
      throw Error(`Action ${action} is not allow`);
    }
  }
};
