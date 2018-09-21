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
    this.config = { value: [] };
  }

  setName(name) {
    this.config.name = name;
  }

  addConfig(name, type, default, event, options) {
    this.config.value.push({ name, type, default, event, options });
  }

  init() {
    const config = this.config;
    const _this = this;

    const configs = [{
      name: 'Alias',
      type: 'string',
      default: 'My ' + config.name,
      event: (value) => {
        _this.that.name = value;
      }
    }, ... config.value];

    configs.forEach((cfg) => {
      if (_this.oldConfig.has(cfg.name)) {
        cfg.default = _this.oldConfig.get(cfg.name);
      }
      _this._config.set(cfg.name, cfg.default);
      if ('function' === typeof cfg.event) {
        _this._events.set(cfg.name, cfg.event);
        cfg.event.call(_this.that, cfg.default);
      }
    });

    const elem = document.createElement('div');
    document.querySelector('.configs').appendChild(elem);
    _this.elem = new Vue({
      el: elem,
      template,
      data: {
        configs,
        values: _this._config,
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

  getConfig() {
    return this._config;
  }

  show() {
    this.elem.show = true;
  }

  remove() {
    this.elem.remove();
  }
}

module.exports = Controller;

