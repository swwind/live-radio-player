'use strict';

const Vue = require('../../dist/vue.min.js');

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

  addConfig(name, type, defaults, event, options) {
    this.config.value.push({ name, type, defaults, event, options });
  }

  init() {
    const config = this.config;
    const _this = this;

    const configs = [{
      name: 'Alias',
      type: 'string',
      defaults: 'My ' + config.name,
      event: (value) => {
        _this.that.name = value;
      }
    }, ... config.value];

    configs.forEach((cfg) => {
      if (_this.oldConfig.has(cfg.name)) {
        cfg.defaults = _this.oldConfig.get(cfg.name);
      }
      _this._config.set(cfg.name, cfg.defaults);
      if ('function' === typeof cfg.event) {
        _this._events.set(cfg.name, cfg.event);
        cfg.event.call(_this.that, cfg.defaults);
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
        top: 100,
        left: 200,
        draging: false,
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

