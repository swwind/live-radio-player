'use strict';

class Viewer {
  constructor() {
    this.comps = [];
    this.body = document.createElement('div');
    this.body.classList.add('stage');
    document.body.insertBefore(this.body, document.body.firstChild);
  }
  addComp(comp) {
    this.comps.push(comp);
    this.body.appendChild(comp.getElement());
    $('.configs').appendChild(comp.controller.getElement());
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
    return JSON.stringify(this.comps.map((comp) => Array.from(comp.getConfig())));
  }
  importConfig(configs) {
    const arr = JSON.parse(configs);
    arr.forEach((item) => {
      const map = new Map(item);
      this.addComp(new (getClassByName(map.get('name')))(map));
    });
  }
}



