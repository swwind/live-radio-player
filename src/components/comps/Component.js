'use strict';

const Controller = require('../Controller');

class Component {
  constructor(oldConfig) {
    this.elem = document.createElement('div');
    this.elem.classList.add('comp');
    this.controller = new Controller(oldConfig);
  }
  getAlias() {
    return this.controller.getAlias();
  }
  getElement() {
    return this.elem;
  }
  remove() {
    this.elem.remove();
    this.controller.remove();
  }
  getConfig(index) {
    const config = this.controller.getConfig();
    config.set('name', this.constructor.name);
    config.set('index', index);
    return config;
  }
}

module.exports = Component;
