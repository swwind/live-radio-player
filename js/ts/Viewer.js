'use strict';

class Viewer {
  constructor(fath) {
    this.comps = [];
    this.body = document.createElement('div');
    this.body.classList.add('stage');
    fath.insertBefore(this.body, fath.firstChild);
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
    state.audioLength = resolveTime(state.audioLength);
    state.progress = resolveTime(state.progress);
    this.comps.forEach((comp) => {
      comp.render(state);
    });
  }
}



