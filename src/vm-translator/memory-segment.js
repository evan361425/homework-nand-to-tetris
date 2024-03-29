import { Push } from './actions/push.js';
import { Pop } from './actions/pop.js';

export class MemorySegment {
  constructor(segment) {
    this.variable = this.getVariable(segment);
  }

  /**
   * @param {string} index
   * @return {Action}
   */
  pop(index) {
    index = this.sanitizeIndex(index);

    switch (this.variable) {
      case 'CONSTANT':
        throw Error('Constant can not be pop');
      case 'STATIC':
        return Pop.static(MemorySegment.staticVar(index));
      case 'TEMP':
        return Pop.temp(index);
      case 'POINTER':
        return Pop.static(index === 0 ? 'THIS' : 'THAT');
      default:
        return Pop.basic(this.variable, index);
    }
  }

  /**
   * @param {string} index
   * @return {Action}
   */
  push(index) {
    index = this.sanitizeIndex(index);

    switch (this.variable) {
      case 'CONSTANT':
        return Push.constant(index);
      case 'STATIC':
        return Push.static(MemorySegment.staticVar(index));
      case 'TEMP':
        return Push.temp(index);
      case 'POINTER':
        return Push.static(index === 0 ? 'THIS' : 'THAT');
      default:
        return Push.basic(this.variable, index);
    }
  }

  /**
   * @param {string} index
   * @return {number}
   */
  sanitizeIndex(index) {
    index = +index;
    if (isNaN(index) || index < 0) {
      throw Error('Index must be a number');
    }

    return index;
  }

  static setStaticFile(source) {
    const folderIndex = source.lastIndexOf('/') + 1;
    MemorySegment.source = source.substr(
      folderIndex,
      source.lastIndexOf('.') - folderIndex,
    );
    console.log(`Setting up static ${MemorySegment.source}`);
  }

  static staticVar(index) {
    return `${MemorySegment.source}.${index}`;
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
}
