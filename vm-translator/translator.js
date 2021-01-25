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
      return ram.push(index);
    case 'pop':
      return ram.pop(index);
    default:
      throw Error('Memory segment action must only be "push" or "pop"');
    }
  }

  static logic(action) {
    switch (action) {
    case 'add':
      return Logic.add().output();
    case 'sub':
      return Logic.sub().output();
    default:
      throw Error(`Action ${action} is not allow`);
    }
  }
};
