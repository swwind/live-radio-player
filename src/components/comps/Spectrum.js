'use strict';

const Component = require('./Component.js');

const getTransformedSpectrum = require('./algo/tf-spectrum.js');

class Spectrum extends Component {
  constructor(config) {
    super(config);
    this.type = 'Spectrum';

    this.style = {};

    this.ctrl.setName('Spectrum Configurations');
    this.ctrl.addConfig('X', 'number', 0, (value) => {
      this.style.top = value;
    });
    this.ctrl.addConfig('Y', 'number', 0, (value) => {
      this.style.left = value;
    });
    this.ctrl.addConfig('Main Color', 'color', '#66ccff', (value) => {
      this.style.color = value;
    });
    this.ctrl.addConfig('Spectrum Height', 'number', 200, (value) => {
      this.style.height = value;
    });
    this.ctrl.addConfig('Spectrum Width', 'number', 1000, (value) => {
      this.style.width = value;
    });
    this.ctrl.addConfig('Spectrum Size', 'number', 64, (value) => {
      this.style.size = value;
    });
    this.ctrl.addConfig('Spectrum Align', 'select', 0, (value) => {
      this.style.align = value;
    }, ['center', 'top', 'bottom']);

    this.ctrl.init();

  }

  render({ frequency }, ctx) {
    const { size, top, left, color, width, height, align } = this.style;

    if (size <= 1) {
      return;
    }

    const res = getTransformedSpectrum(frequency, size);

    let pre_width = 10;
    let pre_space = 0;
    if (pre_width * size > width) {
      pre_width = width / size;
      pre_space = pre_width;
    } else {
      pre_space = (width - pre_width) / (size - 1);
    }
    ctx.fillStyle = color;

    if (align === 'center') {

      for (let i = 0; i < size; ++ i) {
        const len = res[i] / 100 * height;
        ctx.fillRect(left + pre_space * i, top + (height - len) / 2, pre_width, len);
      }

    } else if (align === 'top') {

      for (let i = 0; i < size; ++ i) {
        const len = res[i] / 100 * height;
        ctx.fillRect(left + pre_space * i, top, pre_width, len);
      }

    } else { // if (align === 'bottom')

      for (let i = 0; i < size; ++ i) {
        const len = res[i] / 100 * height;
        ctx.fillRect(left + pre_space * i, top + height - len, pre_width, len);
      }

    }
  }
}

module.exports = Spectrum;
