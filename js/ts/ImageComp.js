'use strict';

class ImageComp {
  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add('image');
    this.elem.classList.add('comp');
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
        name: 'Background',
        type: 'string',
        default: 'var(--album-cover)',
        onChange: (value) => {
          this.elem.style.backgroundImage = value;
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
    });
  }
  getElement() {
    return this.elem;
  }
  remove() {
    this.elem.remove();
  }
  render() { }
}