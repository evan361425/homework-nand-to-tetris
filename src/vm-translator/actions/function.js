import { Action } from '../action.js';
import { Flow } from './flow.js';
import { Pop } from './pop.js';
import { Push } from './push.js';

const RETURN_PREFIX = 'RETURN';
const FUNCTION_PREFIX = 'FUNCTION';
let returnCount = 0;

export class Function {
  /**
   * @param {string} name
   * @param {number} argCounts
   * @return {Action}
   */
  static function(name, argCounts) {
    const action = Flow.label(name, FUNCTION_PREFIX);

    // initial LCL value to 0
    for (let i = 0; i < argCounts; i++) {
      action.concat(Push.constant(0));
    }

    return action;
  }

  /**
   * @param {string} name
   * @param {number} argCounts
   * @return {Action}
   */
  static call(name, argCounts) {
    const action = new Action();
    const returnIndex = (returnCount++).toString();
    // save return pointer to SP
    action.concat(Push.constant(`${RETURN_PREFIX}.${returnIndex}`));
    // save LCL pointer
    action.concat(['@LCL', 'D=M', ...Push.push()]);
    // save ARG pointer
    action.concat(['@ARG', 'D=M', ...Push.push()]);
    // save THIS pointer
    action.concat(['@THIS', 'D=M', ...Push.push()]);
    // save THAT pointer
    action.concat(['@THAT', 'D=M', ...Push.push()]);
    // point ARG to SP before [argCounts] + 5, 5 represent 5 actions before it
    action.concat(
      this.copyTo('ARG', { stepBack: argCounts + 5, pointerOnly: true }),
    );
    // point LCL to SP
    action.concat(this.copyTo('LCL'));
    // goto function
    action.concat(Flow.goto(name, FUNCTION_PREFIX));
    // label return
    action.concat(Flow.label(returnIndex, RETURN_PREFIX));

    return action;
  }

  static return() {
    const action = new Action();
    // return back ARG value
    // ARG = SP data
    action.concat(Pop.basic('ARG'));
    // SP back to original position
    // not using LCL since we don't know argCounts
    action.concat(
      this.copyTo('SP', { from: 'ARG', stepFront: 1, pointerOnly: true }),
    );
    // return pointer to R14
    action.concat(this.copyTo('R14', { from: 'LCL', stepBack: 5 }));
    // resolve THAT
    action.concat(this.copyTo('THAT', { from: 'LCL', stepBack: 1 }));
    // resolve THIS
    action.concat(this.copyTo('THIS', { from: 'LCL', stepBack: 2 }));
    // resolve ARG
    action.concat(this.copyTo('ARG', { from: 'LCL', stepBack: 3 }));
    // resolve LCL
    action.concat(this.copyTo('LCL', { from: 'LCL', stepBack: 4 }));
    // go back
    action.concat(['@R14', 'A=M', '0;JMP']);

    return action;
  }

  /**
   * @param {string} to
   * @param {object} options
   * @return {string[]}
   */
  static copyTo(
    to,
    options = { stepBack: undefined, stepFront: undefined, from: 'SP' },
  ) {
    return [
      `@${options.from}`,
      'D=M',
      ...this.step('front', options.stepFront, options.pointerOnly),
      ...this.step('back', options.stepBack, options.pointerOnly),
      `@${to}`,
      'M=D',
    ];
  }

  /**
   * @param {string} dir
   * @param {string} step
   * @param {bool} pointerOnly
   * @return {string[]}
   */
  static step(dir, step, pointerOnly) {
    if (step === undefined) return [];

    if (dir === 'front') {
      return [`@${step}`, ...(pointerOnly ? ['D=D+A'] : ['A=D+A', 'D=M'])];
    } else {
      return [`@${step}`, ...(pointerOnly ? ['D=D-A'] : ['A=D-A', 'D=M'])];
    }
  }
}
