'use strict';

const Component = require('./Component.js');

class TextComp extends Component {
  constructor(config) {
    super(config);
    this.type = 'Text';

    this.style = {};

    this.ctrl.setName('Text Configurations');
    this.ctrl.addConfig('X', 'number', 0, (value) => {
      this.style.top = value;
    });
    this.ctrl.addConfig('Y', 'number', 0, (value) => {
      this.style.left = value;
    });
    this.ctrl.addConfig('Value', 'multistring', '%title%', (value) => {
      this.style.text = value;
    });
    this.ctrl.addConfig('Color', 'color', '#000000', (value) => {
      this.style.color = value;
    })
    this.ctrl.addConfig('Font Size', 'number', 16, (value) => {
      this.style.fontSize = value;
    })
    this.ctrl.addConfig('Font Family', 'string', 'Arial', (value) => {
      this.style.fontFamily = value;
    });

    this.ctrl.init();

  }

  render(cfg, ctx) {
    const text = this.style.text.replace(/%[^%]+%/g, (t) => {
      const name = t.slice(1, t.length - 1);
      if (!name) return '%';
      return cfg[name] || cfg.trackInfo[name] || "N/A";
    });

    ctx.font = this.style.fontSize + 'px ' + this.style.fontFamily;
    ctx.fillStyle = this.style.color;
    ctx.fillText(text, this.style.left, this.style.top + this.style.fontSize);
  }
}

module.exports = TextComp;
