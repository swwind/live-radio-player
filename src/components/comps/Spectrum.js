'use strict';

const Component = require('./Component.js');

const getTransformedSpectrum = require('./algo/tf-spectrum.js');

class Spectrum extends Component {
  constructor(config) {
    super(config);
    this.type = 'Spectrum';
    this.elem.classList.add(this.type.toLowerCase());
    this.bous = [];
    this.exampleBou = document.createElement('div');
    this.exampleBou.classList.add('spectrum-bou');

    this.ctrl.setName('Spectrum Configurations');
    this.ctrl.addConfig('X', 'number', 0, (value) => {
      this.elem.style.top = value;
    });
    this.ctrl.addConfig('Y', 'number', 0, (value) => {
      this.elem.style.left = value;
    });
    this.ctrl.addConfig('Main Color', 'color', '#66ccff', (value) => {
      this.exampleBou.style.backgroundColor = value;
      this.bous.forEach((bou) => {
        bou.style.backgroundColor = value;
      });
    });
    this.ctrl.addConfig('Spectrum Height', 'number', 200, (value) => {
      this.spectrumHeight = parseFloat(value);
      this.elem.style.height = value;
      this.elem.style.lineHeight = value;
    });
    this.ctrl.addConfig('Spectrum Width', 'number', 1000, (value) => {
      this.elem.style.width = value;
    });
    this.ctrl.addConfig('Spectrum Size', 'number', 64, (value) => {
      this.adjustSpectrumSize(value);
    });
    this.ctrl.addConfig('Spectrum Align', 'select', 0, (value) => {
      this.elem.style.alignItems = value;
    }, ['center', 'flex-start', 'flex-end']);

    this.ctrl.init();

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

  render({ frequency }) {
    window.spectrumSize = this.bous.length;
    const spectrum = getTransformedSpectrum(frequency);
    this.bous.forEach((bou, i) => {
      bou.style.height = spectrum[i] + '%';
    });
  }
}

module.exports = Spectrum;
