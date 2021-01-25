const Pop = require('./pop');
const Push = require('./push');

module.exports = class Logic {
  static add() {
    return this.pop2().concat([
      '@spdata',
      'D=D+M',
    ]).concat(Push.push());
  }

  static sub() {
    return this.pop2().concat([
      '@spdata',
      'D=D-M',
    ]).concat(Push.push());
  }

  static pop2() {
    return Pop.pop().concat([
      '@spdata',
      'M=D',
    ]).concat(Pop.pop());
  }
};
