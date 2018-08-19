'use strict';

let maxZindex = 100;

class SubWindow {
  constructor(title, elem, width, height, px, py) {
    this.elem = document.createElement('div');
    this.elem.classList.add('sub-window');
    this.elem.appendChild(this._createStateBar(title));
    const div = document.createElement('div');
    div.classList.add('sw-container');
    div.appendChild(elem);
    div.addEventListener('mousedown', this.focus.bind(this));
    this.elem.appendChild(div);
    this.setWidth(width || 400);
    this.setHeight(height || 500);
    this.setPosition(px || 200, py || 200);
    this.hide();
  }

  _createStateBar(title) {
    const stateBar = document.createElement('div');
          stateBar.classList.add('sw-statebar')
    const _title = document.createElement('span');
          _title.classList.add('sw-title');
          _title.innerText = title;
    let downing = false;
    let offsetX = 0;
    let offsetY = 0;
    _title.addEventListener('mousedown', (e) => {
      downing = true;
      offsetX = e.offsetX;
      offsetY = e.offsetY;
      this.focus();
      this.elem.classList.add('moving');
    });
    document.addEventListener('mouseup', (e) => {
      downing = false;
      this.elem.classList.remove('moving');
    });
    document.addEventListener('mousemove', (e) => {
      if (downing) {
        this.setPosition(e.clientX - offsetX, e.clientY - offsetY);
      }
    });
    stateBar.appendChild(_title);
    const close = document.createElement('span');
    close.classList.add('sw-close');
    close.innerText = 'X';
    close.addEventListener('click', this.hide.bind(this));
    stateBar.appendChild(close);
    return stateBar;
  }

  setWidth(width) {
    if (typeof width === 'number') {
      width = width + 'px';
    }
    this.elem.style.width = width;
  }

  setHeight(height) {
    if (typeof height === 'number') {
      height = height + 'px';
    }
    this.elem.style.height = height;
  }

  setPosition(x, y) {
    this.elem.style.left = x + 'px';
    this.elem.style.top  = y + 'px';
  }

  show() {
    this.elem.style.display = 'block';
    this.focus();
  }

  hide() {
    this.elem.style.display = 'none';
  }

  getElement() {
    return this.elem;
  }

  focus() {
    $('.sw-focus') && $('.sw-focus').classList.remove('sw-focus');
    this.elem.classList.add('sw-focus');
    this.elem.style.zIndex = ++ maxZindex;
  }

  pinToTop() {
    this.elem.style.zIndex = 1000000;
  }

  remove() {
    this.elem.remove();
  }
}
