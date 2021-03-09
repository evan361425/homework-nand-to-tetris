import { Pop } from './pop.js';

let counter = 0;

export class Logic {
  /**
   * @return {Action}
   */
  static eq() {
    // if D == 0 (equal), jump
    return Pop.pop2().concat(this.logicActions('JEQ'));
  }

  /**
   * @return {Action}
   */
  static lt() {
    // if D < 0 (x < y), jump
    return Pop.pop2().concat(this.logicActions('JLT'));
  }

  /**
   * @return {Action}
   */
  static gt() {
    // if D > 0 (x > y), jump
    return Pop.pop2().concat(this.logicActions('JGT'));
  }

  /**
   * logical action
   * @param {string} logic
   * @return {string[]}
   */
  static logicActions(logic) {
    return [
      'D=M-D', // second minus first
      'M=-1', // default to true
      `@LOGIC.${counter}`,
      `D;${logic}`, // jump to end of this action if is true
      '@SP',
      'A=M-1', // stack pointer is point to new element, go back to set old
      'M=0', // set to false
      `(LOGIC.${counter++})`,
    ];
  }
}
