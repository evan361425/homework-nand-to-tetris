import { Pop } from './pop.js';
import { Action } from '../action.js';

export class Flow {
  /**
   * @param {string} label
   * @param {string} prefix
   * @return {Action}
   */
  static label(label, prefix = 'LABEL') {
    return new Action([`(${prefix}.${label})`]);
  }

  /**
   * @param {string} label
   * @param {string} prefix
   * @return {Action}
   */
  static goto(label, prefix = 'LABEL') {
    return new Action([`@${prefix}.${label}`, '0;JMP']);
  }

  /**
   * -1: true
   * 0: false
   * @param {string} label
   * @return {Action}
   */
  static ifGoto(label) {
    // [last data](D) [not equal 0](true) JMP
    return Pop.pop().concat([`@LABEL.${label}`, 'D;JNE']);
  }
}
