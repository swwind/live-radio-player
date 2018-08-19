'use strict';

class Viewer {
  constructor() {
    this.comps = [];
    this.body = document.createElement('div');
    this.body.classList.add('stage');
    document.body.insertBefore(this.body, document.body.firstChild);
    this.elem = $('.effect-list');
  }

  addComp(comp) {
    this.comps.push(comp);
    this.body.appendChild(comp.getElement());
    $('.configs').appendChild(comp.controller.getElement());
    this.elem.insertBefore(this._createItemElement(comp), this.elem.firstChild);
  }

  _createItemElement(comp) {
    const div = document.createElement('div');
    div.classList.add('list-item');
    const span1 = document.createElement('span');
    span1.innerText = comp.constructor.name;
    span1.classList.add('effect-type');
    const span2 = document.createElement('span');
    span2.innerText = comp.getAlias();
    span2.classList.add('flex1');
    div.appendChild(span1);
    div.appendChild(span2);
    Object.defineProperty(comp.controller, 'alias', {
      set(value) {
        span2.innerText = value;
        return true;
      }
    });
    div.appendChild(spanButton('^', 'move up', (e) => {
      moveUpElement(e.target.parentNode);
      moveDownElement(comp.elem);
      this.comps = moveDownInArray(this.comps, comp);
    }));
    div.appendChild(spanButton('v', 'move down', (e) => {
      moveDownElement(e.target.parentNode);
      moveUpElement(comp.elem);
      this.comps = moveUpInArray(this.comps, comp);
    }));
    div.appendChild(spanButton('c', 'config', (e) => {
      comp.controller.elem.show();
    }));
    div.appendChild(spanButton('x', 'remove', (e) => {
      this.removeComp(comp);
      div.remove();
    }));
    return div;
  }

  removeComp(comp) {
    this.comps = this.comps.filter(c => {
      if (c === comp) {
        c.remove();
        return false;
      }
      return true;
    });
  }

  render(state) {
    state.frequency = state.frequency;
    state.duration = resolveTime(state.duration);
    state.progress = resolveTime(state.progress);
    this.comps.forEach((comp) => {
      comp.render(state);
    });
  }

  exportConfig() {
    return JSON.stringify(this.comps.map((comp, i) => Array.from(comp.getConfig(i))));
  }

  importConfig(configs) {
    const arr = JSON.parse(configs);
    arr.map(x => new Map(x)).sort((m1, m2) => {
      return m1.get('index') - m2.get('index');
    }).forEach((item) => {
      this.addComp(new (getClassByName(item.get('name')))(item));
    });
  }
}



