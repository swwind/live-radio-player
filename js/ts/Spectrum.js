'use strict';

class Spectrum {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.elem = document.createElement('div');
    this.elem.classList.add('spectrum');
    this.bous = [];
    this.exampleBou = document.createElement('div');
    this.exampleBou.classList.add('spectrum-bou');
    for (let i = 0; i < spectrumSize; ++ i) {
      this.addBou();
    }
    this.controller = new Controller([{
      name: 'Spectrum Configurations',
      type: 'panel',
      value: [{
        name: 'Main Color',
        type: 'color',
        default: '#66ccff',
        onChange: (value) => {
          this.bous.forEach((bou) => {
            bou.style.backgroundColor = value;
          });
          this.exampleBou.style.backgroundColor = value;
        }
      }, {
        name: 'Spectrum Height',
        type: 'number',
        default: 300,
        onChange: (value) => {
          this.spectrumHeight = value;
          this.elem.style.height = value + 'px';
          this.elem.style.lineHeight = value + 'px';
        }
      }, {
        name: 'Spectrum Size',
        type: 'number',
        default: 64,
        onChange: (value) => {
          this.adjustSpectrumSize(value);
          this.spectrumSize = value;
        }
      }, {
        name: 'Spectrum Width',
        type: 'number',
        default: 10,
        onChange: (value) => {
          this.bous.forEach((bou) => {
            bou.style.width = value + 'px';
          });
          this.exampleBou.style.width = value + 'px';
        }
      }, {
        name: 'Spectrum Margin',
        type: 'number',
        default: 2,
        onChange: (value) => {
          this.bous.forEach((bou) => {
            bou.style.margin = value + 'px';
          });
          this.exampleBou.style.margin = value + 'px';
        }
      }, {
        name: 'Spectrum Border-Radius',
        type: 'number',
        default: 5,
        onChange: (value) => {
          this.bous.forEach((bou) => {
            bou.style.borderRadius = value + 'px';
          });
          this.exampleBou.style.borderRadius = value + 'px';
        }
      }, {
        name: 'Spectrum Align',
        type: 'select',
        options: ['left', 'center', 'right'],
        onChange: (value) => {
          this.elem.style.textAlign = value;
        }
      }]
    }]);
  }
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
  getElement() {
    return this.elem;
  }
  remove() {
    this.elem.remove();
  }
  adjustSpectrumSize(now) {
    if (now > this.spectrumSize) {
      for (let i = this.spectrumSize; i < now; ++ i) {
        this.addBou();
      }
    }
    if (now < this.spectrumSize) {
      for (let i = this.spectrumSize; i > now; -- i) {
        this.removeBou();
      }
    }
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
    window.spectrumSize = this.spectrumSize;
    window.spectrumHeight = this.spectrumHeight;
    const spectrum = getTransformedSpectrum(frequency);
    this.bous.forEach((bou, i) => {
      bou.style.height = spectrum[i] + 'px';
    });
  }
}

