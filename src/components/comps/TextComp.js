'use strict';

const Component = require('./Component.js');

class TextComp extends Component {
  constructor(config) {
    super(config);
    this.type = 'Text';
    this.elem.classList.add(this.type.toLowerCase());
    this.controller.init({
      name: 'Text Configurations',
      value: [{
        name: 'X',
        type: 'string',
        default: '0px',
        onChange: (value) => {
          this.elem.style.top = value;
        }
      }, {
        name: 'Y',
        type: 'string',
        default: '0px',
        onChange: (value) => {
          this.elem.style.left = value;
        }
      }, {
        name: 'Value',
        type: 'multistring',
        default: '%title% (%progress% / %duration%)\nArtist: %artist%\nAlbum: %album%',
        onChange: (value) => {
          this.text = value;
        }
      }, {
        name: 'Height',
        type: 'string',
        default: '200px',
        onChange: (value) => {
          this.elem.style.height = value;
        }
      }, {
        name: 'Width',
        type: 'string',
        default: '1000px',
        onChange: (value) => {
          this.elem.style.width = value;
        }
      }, {
        name: 'Color',
        type: 'color',
        default: '#000000',
        onChange: (value) => {
          this.elem.style.color = value;
        }
      }, {
        name: 'Font Size',
        type: 'string',
        default: '16px',
        onChange: (value) => {
          this.elem.style.fontSize = value;
        }
      }, {
        name: 'Font Family',
        type: 'string',
        default: 'Arial',
        onChange: (value) => {
          this.elem.style.fontFamily = value;
        }
      }]
    });
  }

  render(cfg) {
    const text = this.text.replace(/%[^%]+%/g, (t) => {
      const name = t.slice(1, t.length - 1);
      return cfg[name] || cfg.trackInfo[name] || "N/A";
    });
    this.elem.innerText = text;
  }
}

module.exports = TextComp;
