const Push = require('./push');
const Pop = require('./pop');

module.exports = class Ram {
  constructor(segment) {
    this.variable = this.getVariable(segment);
  }

  pop(index) {
    index = this.sanitizeIndex(index);

    switch (this.variable) {
    case 'const':
      throw Error('Constant can not be poped');
    case 'static':
      return Pop.static().output();
    case 'TEMP':
      return Pop.temp().output();
    default:
      return Pop.basic(this.variable, index).output();
    }
  }

  push(index) {
    index = this.sanitizeIndex(index);

    switch (this.variable) {
    case 'const':
      return Push.constant(index).output();
    case 'static':
      return Push.static().output();
    case 'TEMP':
      return Push.temp(index).output();
    default:
      this.actions = Push.basic(this.variable, index);
    }
  }

  sanitizeIndex(index) {
    index = +index;
    if (isNaN(index) || index < 0) {
      throw Error('Index must be a number');
    }

    return index;
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
