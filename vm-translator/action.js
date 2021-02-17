module.exports = class Action {
  /**
   * @constructor
   * @param {string[]} actions
   */
  constructor(actions = []) {
    this.actions = actions;
  }

  /**
   * Concat multiple action
   * @param {string[]|Action} actions
   * @return {Action}
   */
  concat(actions) {
    if (actions instanceof Action) {
      actions = actions.actions;
    }

    actions.forEach((el) => {
      this.actions.push(el);
    });

    return this;
  }

  add(action) {
    this.actions.push(action);

    return this;
  }

  output() {
    return this.actions.join(`\n`);
  }
};
