import { Action } from '../action.js';
import { Flow } from './flow.js';
import { Pop } from './pop.js';
import { Push } from './push.js';

let returnCount = 0;

export class Function {
  /**
   * @param {string} name
   * @param {number} argCounts
   * @return {Action}
   */
  static function(name, argCounts) {
    const action = new Action([`(FUNCTION.${name})`]);
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
    const returnLabel = `RETURN.${returnCount++}`;
    const action = new Action([`@${returnLabel}`, 'D=A']);
    action.concat(Push.push());
    // save LCL
    action.concat(['@0', 'D=A', '@R1', 'A=D+A', 'D=M']);
    action.concat(Push.push());
    // save ARG
    action.concat(['@0', 'D=A', '@R2', 'A=D+A', 'D=M']);
    action.concat(Push.push());
    // save THIS
    action.concat(['@0', 'D=A', '@R3', 'A=D+A', 'D=M']);
    action.concat(Push.push());
    // save THAT
    action.concat(['@0', 'D=A', '@R4', 'A=D+A', 'D=M']);
    action.concat(Push.push());
    // pass ARG
    action.concat(['@SP', 'D=M']);
    action.concat([`@${argCounts + 5}`, 'D=D-A']);
    action.concat(['@ARG', 'M=D']);
    // pass LCL
    action.concat(this.switch('SP', 'LCL'));
    // goto
    action.concat(Flow.goto(name));
    action.concat(Flow.label(returnLabel));

    return action;
  }

  static return() {
    const action = new Action(this.switch('LCL', 'R14'));

    // R14 R15
    action.concat(['@R14', 'D=M', `@5`, 'A=D-A', 'D=M', '@R15', 'M=D']);
    // pop
    action.concat(Pop.basic('ARG', 0));
    // back to SP
    action.concat(['@ARG', 'D=M', '@1', 'D=D+A', '@SP', 'M=D']);
    // that
    action.concat(['@R14', 'D=M']);
    action.concat([`@1`, 'A=D-A', 'D=M']);
    action.concat(['@THAT', 'M=D']);
    // this
    action.concat(['@R14', 'D=M']);
    action.concat([`@2`, 'A=D-A', 'D=M']);
    action.concat(['@THIS', 'M=D']);
    // arg
    action.concat(['@R14', 'D=M']);
    action.concat([`@3`, 'A=D-A', 'D=M']);
    action.concat(['@ARG', 'M=D']);
    // local
    action.concat(['@R14', 'D=M']);
    action.concat([`@4`, 'A=D-A', 'D=M']);
    action.concat(['@LCL', 'M=D']);
    //
    action.concat(Flow.goto('R15'));

    return action;
  }

  /**
   * @param {string} from
   * @param {string} to
   * @return {string[]}
   */
  static switch(from, to) {
    return [`@${from}`, 'D=M', `@${to}`, 'M=D'];
  }
}
