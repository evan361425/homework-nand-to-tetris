const Action = require('./action');

module.exports = class Pop {
  static basic(variable, index) {
    const actions = this.pop();
    // go to specific index
    if (index === 0) {
      return actions.concat([
        `@${variable}`,
        'A=M',
        'M=D',
      ]);
    } else if (index < 10) {
      return actions
        .add(`@${variable}`)
        .add('A=M+1')
        .concat(new Array(index-1).fill('A=A+1'))
        .add('M=D');
    } else {
      return actions.concat([
        '@1000',
        'M=D',
        `@${index}`,
        'D=A',
        `@${variable}`,
        'D=M+D',
        '@1001',
        'M=D',
        '@1000',
        'D=M',
        '@1001',
        'A=M',
        'M=D',
      ]);
    }
  }

  static temp(index) {
    index += 5;

    return this.pop().concat([
      `@${index}`,
      'M=D',
    ]);
  }

  static static(variable) {
    return this.pop().concat([
      `@${variable}`,
      'M=D',
    ]);
  }

  static pop() {
    return new Action([
      '@SP',
      'M=M-1', // decrement stack pointer
      'A=M', // go to pointing RAM
      'D=M', // save target data
    ]);
  }

  /**
   * Pop 2 value out and put stack pointer on second value
   *
   * |*|
   * |x| <- SP will be here
   * |y| <- save to D
   *
   * @return {Action}
   */
  static pop2() {
    return Pop.pop().concat([
      '@SP',
      'A=M-1', // get prev element but don't point decrement
    ]);
  }
};
