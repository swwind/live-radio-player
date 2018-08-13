'use strict';

class Spectrum {
  constructor(config) {
    this.elem = document.createElement('div');
    this.elem.classList.add('spectrum');
    this.elem.classList.add('comp');
    this.bous = [];
    this.exampleBou = document.createElement('div');
    this.exampleBou.classList.add('spectrum-bou');
    this.controller = new Controller('Spectrum', {
      name: 'Spectrum Configurations',
      type: 'panel',
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
        name: 'Main Color',
        type: 'color',
        default: '#66ccff',
        onChange: (value) => {
          this.exampleBou.style.backgroundColor = value;
          this.bous.forEach((bou) => {
            bou.style.backgroundColor = value;
          });
        }
      }, {
        name: 'Spectrum Height',
        type: 'string',
        default: '200px',
        onChange: (value) => {
          this.spectrumHeight = parseFloat(value);
          this.elem.style.height = value;
          this.elem.style.lineHeight = value;
        }
      }, {
        name: 'Spectrum Width',
        type: 'string',
        default: '1000px',
        onChange: (value) => {
          this.elem.style.width = value;
        }
      }, {
        name: 'Spectrum Size',
        type: 'number',
        default: 64,
        onChange: (value) => {
          this.adjustSpectrumSize(value);
        }
      }, {
        name: 'Spectrum Border-Radius',
        type: 'string',
        default: '5px',
        onChange: (value) => {
          this.bous.forEach((bou) => {
            bou.style.borderRadius = value;
          });
          this.exampleBou.style.borderRadius = value;
        }
      }, {
        name: 'Spectrum Align',
        type: 'select',
        options: ['flex-start', 'flex-end', 'center'],
        default: 2,
        onChange: (value) => {
          this.elem.style.alignItems = value;
        }
      }]
    }, config || new Map());
  }
  getElement() {
    return this.elem;
  }
  remove() {
    this.elem.remove();
  }
  adjustSpectrumSize(now) {
    while (this.bous.length < now) this.addBou();
    while (this.bous.length > now) this.removeBou();
  }
  addBou() {
    const bou = this.exampleBou.cloneNode();
    this.elem.appendChild(bou);
    this.bous.push(bou);
  }
  removeBou() {
    this.bous.shift().remove();
  }
  getConfig() {
    return this.controller.getConfig();
  }
  render({ frequency }) {
    window.spectrumSize = this.bous.length;
    window.spectrumHeight = this.spectrumHeight;
    const spectrum = getTransformedSpectrum(frequency);
    this.bous.forEach((bou, i) => {
      bou.style.height = spectrum[i] + 'px';
    });
  }
}

