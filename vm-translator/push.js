module.exports = class Push {
  static constant(index) {
    return [
      `@${index}`,
      'D=A',
    ].concat(this.push());
  }

  static basic(variable, index) {
    let actions = [];
    // go to specific index
    if (index === 0) {
      actions = actions.concat([
        `@${variable}`,
        'A=M',
      ]);
    } else if (index === 1) {
      actions = actions.concat([
        `@${variable}`,
        'A=M+1',
      ]);
    } else {
      actions = actions.concat([
        `@${index}`,
        'D=A',
        `@${variable}`,
        'A=M+D',
      ]);
    }

    return actions.concat([
      'D=M', // save target data\
    ]).concat(this.push());
  }

  static static() {
    return [];
  }

  static push() {
    return [
      '@SP', // save to stack
      'A=M',
      'M=D',
      '@SP', // increment stack pointer
      'M=M+1',
    ];
  }
};
