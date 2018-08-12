'use strict';

class Controller {
  constructor(config) {
    if (!config) {
      throw 'java.lang.ArrayIndexOutOfBoundsException';
    }
    this._events = [];
    this.elem = this.config2elem(config);
  }
  config2elem(config) {
    if (!config) {
      throw 'java.lang.NullPointerException';
    }
    if (Array.isArray(config)) {
      const div = document.createElement('div');
      div.classList.add('c-div');
      config.forEach((c) => {
        div.appendChild(this.config2elem(c));
      });
      return div;
    }
    if (config.type === 'panel') {
      const div = document.createElement('div');
      div.classList.add('c-panel');
      const h3 = document.createElement('h3');
      h3.innerText = config.name;
      div.appendChild(h3);
      const child = this.config2elem(config.value);
      div.appendChild(child);
      return div;
    }
    if (config.type === 'color') {
      const div = document.createElement('div');
      div.classList.add('c-color');
      const span = document.createElement('span');
      span.innerText = config.name + ': ';
      const input = document.createElement('input');
      input.setAttribute('type', 'color');
      input.value = config.default;
      input.addEventListener('input', (e) => {
        config.onChange(e.target.value);
      });
      config.onChange(input.value);
      div.appendChild(span);
      div.appendChild(input);
      return div;
    }
    if (config.type === 'number') {
      const div = document.createElement('div');
      div.classList.add('c-number');
      const span = document.createElement('span');
      span.innerText = config.name + ': ';
      const input = document.createElement('input');
      input.setAttribute('type', 'number');
      input.setAttribute('step', 'any');
      input.value = config.default;
      input.addEventListener('input', (e) => {
        config.onChange(e.target.value);
      });
      config.onChange(input.value);
      div.appendChild(span);
      div.appendChild(input);
      return div;
    }
    if (config.type === 'select') {
      const div = document.createElement('div');
      div.classList.add('c-select');
      div.innerHTML = `<span>${config.name}: </span>`;
      const select = document.createElement('select');
      config.options.forEach((opt) => {
        select.innerHTML += `<option>${opt}</option>`;
      });
      select.addEventListener('input', (e) => {
        config.onChange(config.options[e.target.selectedIndex]);
      });
      config.onChange(config.options[0]);
      div.appendChild(select);
      return div;
    }
  }
  getElement() {
    return this.elem;
  }
}



