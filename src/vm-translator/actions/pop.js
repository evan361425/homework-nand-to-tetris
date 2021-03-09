import { Action } from '../action.js';

export class Pop {
  static basic(variable, index) {
    // go to specific index
    if (index === 0) {
      return this.pop().concat([`@${variable}`, 'A=M', 'M=D']);
    } else if (index < 6) {
      return this.pop()
        .add(`@${variable}`)
        .add('A=M+1')
        .concat(new Array(index - 1).fill('A=A+1'))
        .add('M=D');
    } else {
      return new Action([
        `@${index}`,
        'D=A',
        `@${variable}`,
        'D=M+D', // memory pointer of specific variable after [index]
        '@R13',
        'M=D', // save it and will reuse after getting value
      ])
        .concat(this.pop())
        .concat(['@R13', 'A=M', 'M=D']);
    }
  }

  static temp(index) {
    index += 5;

    return this.pop().concat([`@${index}`, 'M=D']);
  }

  static static(variable) {
    return this.pop().concat([`@${variable}`, 'M=D']);
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
}
