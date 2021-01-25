const Action = require('./action');

module.exports = class Push {
  static constant(index) {
    return new Action([
      `@${index}`,
      'D=A',
    ]).concat(this.push());
  }

  static basic(variable, index) {
    const actions = new Action();
    // go to specific index
    if (index === 0) {
      actions.concat([
        `@${variable}`,
        'A=M',
      ]);
    } else if (index === 1) {
      actions.concat([
        `@${variable}`,
        'A=M+1',
      ]);
    } else {
      actions.concat([
        `@${index}`,
        'D=A',
        `@${variable}`,
        'A=M+D',
      ]);
    }

    return actions
      .add('D=M')// save target data
      .concat(this.push());
  }

  static temp(index) {
    index += 5;
    const action = new Action([
      `@${index}`,
      'D=M',
    ]);

    return action.concat(this.push());
  }

  static static() {
    return [];
  }

  static push() {
    return new Action([
      '@SP', // save to stack
      'A=M',
      'M=D',
      '@SP', // increment stack pointer
      'M=M+1',
    ]);
  }
};
