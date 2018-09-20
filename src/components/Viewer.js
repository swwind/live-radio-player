'use strict';

const $ = (name) => document.querySelector(name);
const $$ = (name) => document.getElementById(name);

const { resolveTime } = require('../util.js');

const Vue = require('../dist/vue.min.js');

const cmps = {
  'Text': require('./comps/TextComp.js'),
  'Image': require('./comps/ImageComp.js'),
  'Spectrum': require('./comps/Spectrum.js'),
}

module.exports = () => new Vue({
  el: '#effect-list',
  data: {
    comps: [],
  },
  created() {
    this.stage = document.createElement('canvas');
    this.stage.classList.add('stage');
    this.ctx = this.stage.getContext('2d');
    this.stage.width  = window.innerWidth;
    this.stage.height = window.innerHeight;
    document.body.insertBefore(this.stage, document.body.firstChild);
  },
  methods: {

    addComp(comp) {
      this.comps.push(comp);
      // comp.mount(this.stage);
    },

    addNewComp(type) {
      const Component = cmps[type];
      this.addComp(new Component());
    },

    removeComp(index) {
      this.comps = [...this.comps.slice(0, index), ...this.comps.slice(index + 1)];
    },

    render(state) {
      state.frequency = state.frequency;
      state.duration = resolveTime(state.duration);
      state.progress = resolveTime(state.progress);
      this.ctx.clearRect(0, 0, this.stage.width, this.stage.height);
      this.comps.forEach((comp) => {
        comp.render(state, this.ctx);
      });
    },

    exportConfig() {
      return JSON.stringify(this.comps.map((comp, i) => Array.from(comp.getConfig(i))));
    },

    importConfig(configs) {
      const arr = JSON.parse(configs);
      arr.map(x => new Map(x)).sort((m1, m2) => {
        return m1.get('index') - m2.get('index');
      }).forEach((item) => {
        const Item = cmps[item.get('type')];
        console.log(item.get('type'));
        this.addComp(new Item(item));
      });
    }

  }
});

