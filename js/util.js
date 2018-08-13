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
  const getEncodeFormat = (code) => {
    switch (code) {
      case '\x00': return 'ISO-8859-1';
      case '\x01': return 'UCS-2';
      case '\x02': return 'UTF-16BE';
      case '\x03': return 'UTF-8';
    }
  }
  const filesize = calc(data.substr(index + 4, 4));
  const title = data.substr(index + 10, filesize);
  const encodeFormat = getEncodeFormat(title.charAt(0));
  const array = Array.from(title).slice(1).map(c => c.charCodeAt(0));
  return new TextDecoder(encodeFormat).decode(new Uint8Array(array));
}

const parseAlbum  = parseString('TALB');
const parseTitle  = parseString('TIT2');
const parseAuthor = parseString('TPE1');

const parseTrackInfo = (data) => {
  return {
    cover: parseCover(data),
    title: parseTitle(data),
    album: parseAlbum(data),
    author: parseAuthor(data),
  }
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

