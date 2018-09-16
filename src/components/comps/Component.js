'use strict';

const Controller = require('../Controller');

class Component {
  constructor(oldConfig) {
    this.elem = document.createElement('div');
    this.elem.classList.add('comp');
    this.controller = new Controller(this, oldConfig);
  }
  getConfig(index) {
    const config = this.controller.getConfig();
    config.set('type', this.type);
    config.set('index', index);
    return config;
  }
  mount(stage) {
    stage.appendChild(this.elem);
  }
  show() {
    this.controller.show();
  }
  remove() {
    this.elem.remove();
    this.controller.remove();
  }
}

module.exports = Component;
