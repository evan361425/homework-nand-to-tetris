const Ram = require('./ram');

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
      ram.push(index);
      break;
    case 'pop':
      ram.pop(index);
      break;
    default:
      throw Error('Memory segment action must only be "push" or "pop"');
    }

    return ram.toString();
  }

  static logic(action) {
    return action;
  }
};
