'use strict';

class ImageComp extends Component {
  constructor(config) {
    super(config);
    this.elem.classList.add('image');
    this.animate = {
      width: 0,
      height: 0,
      translateX: 1,
      translateY: 1,
      scaleX: 2,
      scaleY: 2,
      defaultScaleX: 1,
      defaultScaleY: 1,
    };
    this.controller.init({
      name: 'Image Configurations',
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
        default: 'shake auto-rotate',
        onChange: (value) => {
          this.animate.shake = /\bshake\b/i.test(value);
          this.animate.autoRotate = /\bauto-rotate\b/i.test(value);
          this.animate.randomOffset = /\brandom-offset\b/i.test(value);
          if (/scale\(([^\)]+)\)/i.test(value)) {
            const res = /scale\(([^\)]+)\)/i.exec(value);
            const arg = res[1].split(',').map((x) => parseFloat(x.trim()));
            if (arg.length === 1) arg.push(arg[0]);
            this.animate.defaultScaleX = arg[0];
            this.animate.defaultScaleY = arg[1];
          }
        }
      }]
    });
  }

  render({ high }) {
    const now = + new Date();
    this.animate.scaleX = (this.animate.shake ? high * 0.5 + 1 : 1) * this.animate.defaultScaleX;
    this.animate.scaleY = (this.animate.shake ? high * 0.5 + 1 : 1) * this.animate.defaultScaleY;
    if (this.animate.randomOffset) {
      const pt1 = randomLinearFunction(now, 2656, 5164, 5198, 1564, 9151);
      const pt2 = randomLinearFunction(now, 5161, 3215, 1324, 2655, 5622);
      const pt3 = randomLinearFunction(now, 1565, 5123, 6816, 8153, 1654);
      const pt4 = randomLinearFunction(now, 9156, 4321, 2325, 3546, 7546);
      this.animate.translateX = (pt1 - pt2) / 2 * 100;
      this.animate.translateY = (pt3 - pt4) / 2 * 100;
    } else {
      this.animate.translateX = 0;
      this.animate.translateY = 0;
    }
    const deg = this.animate.autoRotate ? - new Date() / 3000 : 0;
    const sindeg = Math.sin(deg);
    const cosdeg = Math.cos(deg);
    const matrix = [0, 0, 0, 0, 0, 0];
    matrix[0] =   cosdeg * this.animate.scaleX;
    matrix[1] = - sindeg * this.animate.scaleX;
    matrix[2] =   sindeg * this.animate.scaleY;
    matrix[3] =   cosdeg * this.animate.scaleY;
    matrix[4] = this.animate.translateX;
    matrix[5] = this.animate.translateY;
    this.elem.style.transform = `matrix(${matrix})`;
  }
}