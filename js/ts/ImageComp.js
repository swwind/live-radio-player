'use strict';

class ImageComp {
  constructor(config) {
    this.elem = document.createElement('div');
    this.elem.classList.add('image');
    this.elem.classList.add('comp');
    this.controller = new Controller('ImageComp', {
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
        name: 'Height',
        type: 'string',
        default: '200px',
        onChange: (value) => {
          this.elem.style.height = value;
        }
      }, {
        name: 'Width',
        type: 'string',
        default: '200px',
        onChange: (value) => {
          this.elem.style.width = value;
        }
      }, {
        name: 'Radius',
        type: 'string',
        default: '50%',
        onChange: (value) => {
          this.elem.style.borderRadius = value;
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
  getConfig() {
    return this.controller.getConfig();
  }
  render() { }
}