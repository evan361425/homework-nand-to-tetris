const Pop = require('./pop');

export class Arithmetic {
  static add() {
    return Pop.pop2().concat([
      'M=D+M',
    ]);
  }

  static sub() {
    return Pop.pop2().concat([
      'M=M-D',
    ]);
  }

  static and() {
    return Pop.pop2().concat([
      'M=D&M',
    ]);
  }

  static or() {
    return Pop.pop2().concat([
      'M=D|M',
    ]);
  }
}
