module.exports = class Action {
  constructor(actions = []) {
    this.actions = actions;
  }

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
