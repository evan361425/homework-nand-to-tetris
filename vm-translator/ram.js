const Push = require('./push');
const Pop = require('./pop');

module.exports = class Ram {
  constructor(segment) {
    this.variable = this.getVariable(segment);
  }

  pop(index) {
    index = this.sanitizeIndex(index);

    switch (this.variable) {
    case 'CONSTANT':
      throw Error('Constant can not be poped');
    case 'STATIC':
      return Pop.static(Ram.staticVar(index)).output();
    case 'TEMP':
      return Pop.temp(index).output();
    case 'POINTER':
      return Pop.static(index === 0 ? 'THIS' : 'THAT').output();
    default:
      return Pop.basic(this.variable, index).output();
    }
  }

  push(index) {
    index = this.sanitizeIndex(index);

    switch (this.variable) {
    case 'CONSTANT':
      return Push.constant(index).output();
    case 'STATIC':
      return Push.static(Ram.staticVar(index)).output();
    case 'TEMP':
      return Push.temp(index).output();
    case 'POINTER':
      return Push.static(index === 0 ? 'THIS' : 'THAT').output();
    default:
      return Push.basic(this.variable, index).output();
    }
  }

  sanitizeIndex(index) {
    index = +index;
    if (isNaN(index) || index < 0) {
      throw Error('Index must be a number');
    }

    return index;
  }

  static setStaticFile(source) {
    const folderIndex = source.lastIndexOf('/') + 1;
    Ram.source = source.substr(folderIndex, source.lastIndexOf('.') - folderIndex);
  }

  static staticVar(index) {
    return `${Ram.source}.${index}`;
  }

  /**
   * Translate to variable
   * @param  {string} segment
   * @return {string}
   */
  getVariable(segment) {
    switch (segment.toLowerCase()) {
    case 'local':
      return 'LCL';
    case 'argument':
      return 'ARG';
    case 'pointer':
    case 'static':
    case 'this':
    case 'that':
    case 'temp':
    case 'constant':
      return segment.toUpperCase();
    default:
      throw Error('Wrong memory segment');
    }
  }
};
