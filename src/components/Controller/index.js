'use strict';

const fs = require('fs');
const Vue = require('../../dist/vue.min.js');

require.extensions['.vue'] = (module, filename) => {
    module.exports = fs.readFileSync(filename, 'utf8');
};

const template = require('./template.vue');

class Controller {
  constructor(that, oldConfig) {
    this.that = that;
    this.oldConfig = oldConfig || new Map();
    this._config = new Map();
    this._events = new Map();
  }

  init(config) {
    const _this = this;

    const configs = [{
      name: 'Alias',
      type: 'string',
      default: 'My ' + config.name,
      onChange: (value) => {
        this.alias = value;
      }
    }, ... config.value];

    configs.forEach((cfg) => {
      if (_this.oldConfig.has(cfg.name)) {
        cfg.default = _this.oldConfig.get(cfg.name);
      }
      if ('function' === typeof cfg.onChange) {
        _this._events.set(cfg.name, cfg.onChange);
        cfg.onChange.call(_this.that, cfg.default);
      }
    });

    const elem = document.createElement('div');
    document.querySelector('.configs').appendChild(elem);
    _this.elem = new Vue({
      el: elem,
      template,
      data: {
        configs,
        title: 'Hello world',
        show: false,
        top: 300,
        left: 700,
      },
      methods: {
        change(name, value) {
          _this._config.set(name, value);
          if (_this._events.has(name)) {
            _this._events.get(name).call(_this.that, value);
          }
        }
      }
    });
  }

  getElement() {
  }

  getConfig() {
    return this._config;
  }

  remove() {
  }

  show() {
    console.log(this.elem);
    this.elem.show = true;
  }
}

module.exports = Controller;

