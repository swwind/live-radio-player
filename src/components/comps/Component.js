'use strict';

const Controller = require('../Controller');

class Component {
  constructor(oldConfig) {
    this.ctrl = new Controller(this, oldConfig);
  }
  getConfig(index) {
    const config = this.ctrl.getConfig();
    config.set('type', this.type);
    config.set('index', index);
    return config;
  }
  show() {
    this.ctrl.show();
  }
  remove() {
    this.ctrl.remove();
  }
}

module.exports = Component;
