const Action = require('./action');

module.exports = class Pop {
  static static() {
    return [];
  }

  static basic(variable, index) {
    const actions = this.pop();
    // go to specific index
    if (index === 0) {
      return actions.saveTo(variable);
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

  static pop() {
    return new Action([
      '@SP',
      'M=M-1', // decrement stack pointer
      'A=M', // go to pointing RAM
      'D=M', // save target data
    ]);
  }
};
