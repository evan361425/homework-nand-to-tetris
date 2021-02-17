const Pop = require('./pop');
const Action = require('./action');

let counter = 0;

module.exports = class Logic {
  // MATH

  static add() {
    return this.pop2().concat([
      'M=D+M',
    ]);
  }

  static sub() {
    return this.pop2().concat([
      'M=M-D',
    ]);
  }

  static and() {
    return this.pop2().concat([
      'M=D&M',
    ]);
  }

  static or() {
    return this.pop2().concat([
      'M=D|M',
    ]);
  }

  // LOGIC

  static eq() {
    // if D == 0 (equal), jump
    return this.pop2().concat(this.logicAction('JEQ'));
  }

  static lt() {
    // if D < 0 (x < y), jump
    return this.pop2().concat(this.logicAction('JLT'));
  }

  static gt() {
    // if D > 0 (x > y), jump
    return this.pop2().concat(this.logicAction('JGT'));
  }

  static neg() {
    return new Action([
      '@SP',
      'A=M-1', // negative last element
      'M=-M',
    ]);
  }

  static not() {
    return new Action([
      '@SP',
      'A=M-1', // negative last element
      'M=!M',
    ]);
  }

  // HELPER

  /**
   * @return {Action}
   */
  static pop2() {
    return Pop.pop().concat([
      '@SP',
      'A=M-1', // get prev element but don't point decrement
    ]);
  }

  /**
   * logical action
   * @param {string} logic
   * @return {string[]}
   */
  static logicAction(logic) {
    return [
      'D=M-D',
      'M=-1', // default to true
      `@JUMP.${counter}`,
      `D;${logic}`, // jump to end of this action if is true
      '@SP',
      'A=M-1', // stack pointer is point to new element, go back to set old
      'M=0', // set to false
      `(JUMP.${counter++})`,
    ];
  }
};
