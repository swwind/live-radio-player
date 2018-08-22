'use strict';

const backend = require('./js/backend');
const jsmediatags = require('jsmediatags');

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

const arrayToBase64 = (arr) => {
  let res = '';
  arr.forEach((c) => {
    res += String.fromCharCode(c);
  });
  return btoa(res);
}

const encodeCover = (pic) => {
  return pic ? 'data:' + pic.format + ';base64,' + arrayToBase64(pic.data) : '';
}

const parseTrackInfo = (file) => {
  return new Promise((resolve, reject) => {
    jsmediatags.read(file, {
      onSuccess: (data) => {
        const cover = encodeCover(data.tags.picture);
        resolve({
          cover: cover,
          album: data.tags.album,
          title: data.tags.title,
          artist: data.tags.artist
        });
      },
      onError: reject
    });
  });
}

const parseTrackInfoFromNetEaseCloudMusic = (id, title) => {
  return new Promise((resolve, reject) => {
    backend.netease.musicinfo(id).then((res) => {
      const info = res.songs[0];
      resolve({
        cover: info.al.picUrl,
        album: info.al.name,
        title: info.name,
        artist: info.ar.map((art) => art.name).join('/')
      });
    }, (err) => {
      resolve({ title });
    });
  });
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

const getClassByName = (name) => {
  return (Function('return ' + name))();
}

const moveUpElement = (node) => {
  if (node.previousElementSibling) {
    const prev = node.previousElementSibling;
    const pare = node.parentElement;
    node.remove();
    pare.insertBefore(node, prev);
  }
}

const moveDownElement = (node) => {
  if (node.nextElementSibling) {
    const next = node.nextElementSibling;
    const pare = node.parentElement;
    node.remove();
    pare.insertBefore(node, next.nextSibling);
  }
}

const moveUpInArray = (arr, elem) => {
  const index = arr.indexOf(elem);
  if (index > 0) {
    const tmp = arr[index];
    arr[index] = arr[index - 1];
    arr[index - 1] = tmp;
  }
  return arr;
}

const moveDownInArray = (arr, elem) => {
  const index = arr.indexOf(elem);
  if (index > -1 && index < arr.length - 1) {
    const tmp = arr[index];
    arr[index] = arr[index + 1];
    arr[index + 1] = tmp;
  }
  return arr;
}

const randomLinearFunction = (now, ...args) => {
  return [...args].map((w) => Math.sin(now / w)).reduce((a, b) => a * b);
}

const last = (array) => {
  return array[array.length - 1];
}

const randomToken = (len) => {
  const str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
  let res = '';
  while (len --) {
    res += str.charAt(rand(str.length));
  }
  return res;
}
