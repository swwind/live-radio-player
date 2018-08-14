'use strict';

class ImageComp {
  constructor(config) {
    this.elem = document.createElement('div');
    this.elem.classList.add('image');
    this.elem.classList.add('comp');
    this.animate = {
      width: 0,
      height: 0,
      translateX: 0,
      translateY: 0,
      scaleX: 2,
      scaleY: 2,
    };
    this.controller = new Controller({
      name: 'Image Configurations',
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
        name: 'Height',
        type: 'string',
        default: '200px',
        onChange: (value) => {
          this.elem.style.height = value;
          this.animate.height = parseFloat(value);
        }
      }, {
        name: 'Width',
        type: 'string',
        default: '200px',
        onChange: (value) => {
          this.elem.style.width = value;
          this.animate.width = parseFloat(value);
        }
      }, {
        name: 'Anchor',
        type: 'select',
        default: 0,
        options: ['left top', 'left bottom', 'right top', 'right bottom', 'center'],
        onChange: (value) => {
          if (value.indexOf('left')   >= 0) this.animate.translateX = 0;
          if (value.indexOf('right')  >= 0) this.animate.translateX = -1;
          if (value.indexOf('top')    >= 0) this.animate.translateY = 0;
          if (value.indexOf('bottom') >= 0) this.animate.translateY = -1;
          if (value === 'center') {
            this.animate.translateX = -.5;
            this.animate.translateY = -.5;
          }
        }
      }, {
        name: 'Background Image',
        type: 'string',
        default: 'var(--album-cover)',
        onChange: (value) => {
          this.elem.style.backgroundImage = value;
        }
      }, {
        name: 'Background Color',
        type: 'color',
        default: '#fff',
        onChange: (value) => {
          this.elem.style.backgroundColor = value;
        }
      }, {
        name: 'Radius',
        type: 'string',
        default: '50%',
        onChange: (value) => {
          this.elem.style.borderRadius = value;
        }
      }, {
        name: 'Animation',
        type: 'string',
        default: 'none',
        onChange: (value) => {
          this.elem.style.transform = value;
        }
      }]
    }, config || new Map());
  }
  getElement() {
    return this.elem;
  }
  remove() {
    this.elem.remove();
    this.controller.remove();
  }
  getConfig() {
    const config = this.controller.getConfig();
    config.set('name', this.constructor.name);
    return config;
  }
  render({ high }) {
    this.animate.scaleX = high * 0.5 + 1;
    this.animate.scaleY = high * 0.5 + 1;
    const deg = - new Date() / 3000;
    const sindeg = Math.sin(deg);
    const cosdeg = Math.cos(deg);
    const matrix = [0, 0, 0, 0, 0, 0];
    matrix[0] =   cosdeg * this.animate.scaleX;
    matrix[1] = - sindeg * this.animate.scaleX;
    matrix[2] =   sindeg * this.animate.scaleY;
    matrix[3] =   cosdeg * this.animate.scaleY;
    matrix[4] = this.animate.translateX * this.animate.width;
    matrix[5] = this.animate.translateY * this.animate.height;
    this.elem.style.transform = `matrix(${matrix.toString()})`;
  }
}