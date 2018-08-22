'use strict';

class ImageComp extends Component {
  constructor(config) {
    super(config);
    this.elem.classList.add('image');
    this.animate = {
      width: 0,
      height: 0,
      scaleX: 1,
      scaleY: 1,
      rotate: 0,
      shake: false,
      autoRotate: false,
      randomOffset: false,
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
        name: 'Width',
        type: 'string',
        default: '200px',
        onChange: (value) => {
          this.elem.style.width = value;
          this.animate.width = this.elem.width;
        }
      }, {
        name: 'Height',
        type: 'string',
        default: '200px',
        onChange: (value) => {
          this.elem.style.height = value;
          this.animate.height = this.elem.height;
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
        type: 'multistring',
        default: 'shake auto-rotate',
        onChange: (value) => {
          this.animate.shake = /\bshake\b/i.test(value);
          this.animate.autoRotate = /\bauto-rotate\b/i.test(value);
          this.animate.randomOffset = /\brandom-offset\b/i.test(value);
          const scaleRegex = /scale\(([^\)]+)\)/i;
          if (scaleRegex.test(value)) {
            const res = scaleRegex.exec(value);
            const arg = res[1].split(',').map((x) => parseFloat(x.trim()));
            if (arg.length === 1) arg.push(arg[0]);
            this.animate.scaleX = arg[0];
            this.animate.scaleY = arg[1];
          } else {
            this.animate.scaleX = 1;
            this.animate.scaleY = 1;
          }
          const rotateRegex = /rotate\(([^\)]+)\)/i;
          if (rotateRegex.test(value)) {
            const res = rotateRegex.exec(value);
            const arg = parseFloat(res[1]);
            this.animate.rotate = arg / 180 * Math.PI;
          } else {
            this.animate.rotate = 0;
          }
        }
      }]
    });
  }

  render({ high }) {
    const now = + new Date();
    const scaleX = (this.animate.shake ? high * 0.5 + 1 : 1) * this.animate.scaleX;
    const scaleY = (this.animate.shake ? high * 0.5 + 1 : 1) * this.animate.scaleY;
    let translateX = 0, translateY = 0;
    if (this.animate.randomOffset) {
      const pt1 = randomLinearFunction(now, 2656, 5164, 5198, 1564, 9151);
      const pt2 = randomLinearFunction(now, 5161, 3215, 1324, 2655, 5622);
      const pt3 = randomLinearFunction(now, 1565, 5123, 6816, 8153, 1654);
      const pt4 = randomLinearFunction(now, 9156, 4321, 2325, 3546, 7546);
      translateX = (pt1 - pt2) / 2 * 100;
      translateY = (pt3 - pt4) / 2 * 100;
    }
    const deg = this.animate.autoRotate ? - new Date() / 3000 : this.animate.rotate;
    const sindeg = Math.sin(deg);
    const cosdeg = Math.cos(deg);
    const matrix = [0, 0, 0, 0, 0, 0];
    matrix[0] =   cosdeg * scaleX;
    matrix[1] = - sindeg * scaleX;
    matrix[2] =   sindeg * scaleY;
    matrix[3] =   cosdeg * scaleY;
    matrix[4] = translateX;
    matrix[5] = translateY;
    this.elem.style.transform = `matrix(${matrix})`;
  }
}