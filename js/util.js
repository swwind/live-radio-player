'use strict';

const resolveTime = (m) => {
  if (m === undefined || isNaN(m)) return '--:--';
  const rm = Math.round(m);
  return padStart(Math.floor(rm / 60), 2) + ':' + padStart(rm % 60, 2);
}

const padStart = (n, m) => {
  return '0'.repeat(m - n.toString().length) + n;
}

// [0, n)
const rand = (n) => {
  return Math.floor(Math.random() * n);
}

// [a, b]
const xrand = (a, b) => {
  return a + rand(b - a + 1);
}

const parseCover = (data) => {
  if (data.substr(0, 3) !== 'ID3') {
    return false;
  }
  const index = data.indexOf('APIC');
  if (index < 0) {
    return false;
  }
  const calc = (code) => {
    const res = code.charCodeAt(0) * 0x1000000
              + code.charCodeAt(1) * 0x10000
              + code.charCodeAt(2) * 0x100
              + code.charCodeAt(3) * 0x1;
    return res;
  }
  const filesize = calc(data.substr(index + 4, 4));
  const pic1 = data.substr(index + 10, filesize);
  const pic2 = pic1.slice(pic1.indexOf('\xff\xd8'));
  return 'data:image/jpeg;base64,' + btoa(pic2);
}

const parseString = (tag) => (data) => {
  if (data.substr(0, 3) !== 'ID3') {
    return false;
  }
  const index = data.indexOf(tag);
  if (index < 0) {
    return false;
  }
  const calc = (code) => {
    const res = code.charCodeAt(0) * 0x1000000
              + code.charCodeAt(1) * 0x10000
              + code.charCodeAt(2) * 0x100
              + code.charCodeAt(3) * 0x1;
    return res;
  }
  const decodeString = (str) => {
    const arr = Array.from(str).map(c => c.charCodeAt(0));
    const code = arr.shift();
    if (code === 0 && !arr[arr.length - 1]) {
      arr.splice(-1, 1);
    }
    switch (code) {
      case 0: return new TextDecoder('ISO-8859-1').decode(new Uint8Array(arr));
      case 1: return new TextDecoder('UCS-2').decode(new Uint8Array(arr));
      case 2: return new TextDecoder('UTF-16BE').decode(new Uint8Array(arr));
      case 3: return new TextDecoder('UTF-8').decode(new Uint8Array(arr));
    }
  }
  const filesize = calc(data.substr(index + 4, 4));
  return decodeString(data.substr(index + 10, filesize));
}

const parseAlbum  = parseString('TALB');
const parseTitle  = parseString('TIT2');
const parseAuthor = parseString('TPE1');

const parseTrackInfo = (data) => {
  const cover  = parseCover(data);
  const album  = parseAlbum(data);
  const title  = parseTitle(data) || album;
  const author = parseAuthor(data);
  return { cover, album, title, author };
}

class CssController {
  constructor() {
    this.elem = document.createElement('style');
    this.props = new Map();
    document.head.appendChild(this.elem);
  }
  set(key, value) {
    this.props.set(key, value);
    this.render();
  }
  render() {
    this.elem.innerHTML = ':root{' + Array.from(this.props).map(([key, value]) => `${key}:${value}`).join(';') + '}';
  }
}

const spanButton = (text, title, onclick, classes) => {
  const span = document.createElement('span');
  span.innerText = text;
  span.classList.add('span-button');
  span.setAttribute('title', title);
  if (typeof onclick === 'function') {
    span.addEventListener('click', onclick);
  } else {
    classes = onclick;
  }
  if (Array.isArray(classes)) classes.forEach((cls) => span.classList.add(cls));
  else typeof classes === 'string' && span.classList.add(classes);
  return span;
}

