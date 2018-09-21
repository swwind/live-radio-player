'use strict';

const Controller = require('../Controller');

class Component {
  constructor(oldConfig) {
    this.elem = document.createElement('div');
    this.elem.classList.add('comp');
    this.ctrl = new Controller(this, oldConfig);
  }
  getConfig(index) {
    const config = this.ctrl.getConfig();
    config.set('type', this.type);
    config.set('index', index);
    return config;
  }
  mount(stage) {
    stage.appendChild(this.elem);
  }
  show() {
    this.ctrl.show();
  }
  remove() {
    this.elem.remove();
    this.ctrl.remove();
  }
}

module.exports = Component;
