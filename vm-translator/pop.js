module.exports = class Pop {
  static static() {
    return [];
  }

  static basic(variable, index) {
    const actions = this.pop();
    // go to specific index
    if (index === 0) {
      return actions.concat([
        `@${variable}`,
        'A=M',
        'M=D',
      ]);
    } else if (index === 1) {
      return actions.concat([
        `@${variable}`,
        'A=M+1',
        'M=D',
      ]);
    } else {
      return actions.concat([
        '@spdata',
        'M=D',
        `@${index}`,
        'D=A',
        `@${variable}`,
        'D=M+D',
        '@sptarget',
        'M=D',
        '@spdata',
        'D=M',
        '@sptarget',
        'A=M',
        'M=D',
      ]);
    }
  }

  static pop() {
    return [
      '@SP',
      'M=M-1', // decrement stack pointer
      'A=M', // go to pointing RAM
      'D=M', // save target data
    ];
  }
};
