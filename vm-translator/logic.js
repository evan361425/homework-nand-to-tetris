const Pop = require('./pop');

module.exports = class Logic {
  static add() {
    return this.pop2().concat([
      'M=M+D',
    ]);
  }

  static sub() {
    return this.pop2().concat([
      'M=M-D',
    ]);
  }

  static pop2() {
    return Pop.pop().concat([
      '@SP',
      'A=M-1', // get prev element but don't point decrement
    ]);
  }
};
