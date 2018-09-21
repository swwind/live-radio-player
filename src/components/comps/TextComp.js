'use strict';

const Component = require('./Component.js');

class TextComp extends Component {
  constructor(config) {
    super(config);
    this.type = 'Text';
    this.elem.classList.add(this.type.toLowerCase());

    this.ctrl.setName('Text Configurations');
    this.ctrl.addConfig('X', 'number', 0, (value) => {
      this.elem.style.top = value;
    });
    this.ctrl.addConfig('Y', 'number', 0, (value) => {
      this.elem.style.left = value;
    });
    this.ctrl.addConfig('Height', 'number', 200, (value) => {
      this.elem.style.height = value;
    });
    this.ctrl.addConfig('Width', 'number', 1000, (value) => {
      this.elem.style.width = value;
    });
    this.ctrl.addConfig('Value', 'multistring', '%title%', (value) => {
      this.text = value;
    });
    this.ctrl.addConfig('Color', 'color', '#000', (value) => {
      this.elem.style.color = value;
    })
    this.ctrl.addConfig('Font Size', 'number', 16, (value) => {
      this.elem.style.fontSize = value;
    })
    this.ctrl.addConfig('Font Family', 'string', 'Arial', (value) => {
      this.elem.style.fontFamily = value;
    });
    this.ctrl.init();
  }

  render(cfg) {
    const text = this.text.replace(/%[^%]+%/g, (t) => {
      const name = t.slice(1, t.length - 1);
      if (!name) return '%';
      return cfg[name] || cfg.trackInfo[name] || "N/A";
    });
    this.elem.innerText = text;
  }
}

module.exports = TextComp;
