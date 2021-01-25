const Push = require('./push');
const Pop = require('./pop');

module.exports = class Ram {
  constructor(segment) {
    this.variable = this.getVariable(segment);
  }

  pop(index) {
    this.setIndex(index);
    switch (this.variable) {
    case 'const':
      throw Error('Constant can not be poped');
    case 'static':
      this.actions = Pop.static();
      break;
    default:
      this.actions = Pop.basic(this.variable, this.index);
    }
  }

  push(index) {
    this.setIndex(index);
    switch (this.variable) {
    case 'const':
      this.actions = Push.constant(this.index);
      break;
    case 'static':
      this.actions = Push.static();
      break;
    default:
      this.actions = Push.basic(this.variable, this.index);
    }
  }

  setIndex(index) {
    this.index = +index;
    if (isNaN(this.index) || this.index < 0) {
      throw Error('Index must be a number');
    }
  }

  toString() {
    return this.actions.join(`\n`);
  }

  /**
   * Translate to variable
   * @param  {string} segment
   * @return {string}
   */
  getVariable(segment) {
    switch (segment.toLowerCase()) {
    case 'constant':
      return 'const';
    case 'local':
      return 'LCL';
    case 'argument':
      return 'ARG';
    case 'this':
    case 'that':
    case 'temp':
      return segment.toUpperCase();
    default:
      throw Error('Wrong memory segment');
    }
  }
};
