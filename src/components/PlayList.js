'use strict';

const fs = require('fs');
const path = require('path');

const $ = (name) => document.querySelector(name);
const $$ = (name) => document.getElementById(name);

const Vue = require('../dist/vue.min.js');

const { randomToken, randomItem } = require('../util.js');

const backend = require('../backend');
const jsmediatags = require('jsmediatags');

const parseTrackInfoFromFile = (file) => {
  const arrayToBase64 = (arr) => {
    let res = '';
    for (let i = 0; i < arr.length; ++ i) {
      res += String.fromCharCode(arr[i]);
    }
    return btoa(res);
  }
  const encodeCover = (pic) => {
    return pic ? 'data:' + pic.format + ';base64,' + arrayToBase64(pic.data) : '';
  }
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

module.exports = () => new Vue({
  el: '#play-list',
  data: {
    files: new Map(),
    trackInfo: {},
    cssc: new CssController(),
    playing: '',
  },
  created() {
    this.audioElement = $('audio');
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.audioSrc = this.audioContext.createMediaElementSource(this.audioElement);
    this.audioSrc.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
    this.analyser.fftSize = 16384;
    this.analyser.smoothingTimeConstant = 0.1;
    this.frequency = new Uint8Array(this.analyser.frequencyBinCount);
  },
  methods: {

    addTrackFromFile(file) {
      const token = randomToken(6);
      const item = { type: 'file', path: file.path, name: file.name };
      this.files.set(token, item);
      this.$forceUpdate();
      return token;
    },

    addTrackFromFiles(files) {
      Array.from(files).forEach(this.addTrackFromFile.bind(this));
    },

    addTrackFromUrl(url, name, id) {
      const token = randomToken(6);
      const item = { type: 'url', url, name, id };
      this.files.set(token, item);
      this.$forceUpdate();
      return token;
    },

    importList(str) {
      const list = JSON.parse(str);
      list.forEach((item) => {
        if (item.type === 'file') {
          this.addTrackFromFile(item);
        }
        if (item.type === 'url') {
          this.addTrackFromUrl(item.url, item.name, item.id);
        }
      });
    },

    exportList() {
      return JSON.stringify(Array.from(this.files.values()));
    },

    loadTrackInfo(token) {
      const track = this.files.get(token);

      if (!token) {
        return new Promise((resolve, reject) => reject('Token not found'));
      }

      // load from file
      if (track.type === 'file') {

        return new Promise((resolve, reject) => {

          const url = 'file://' + track.path;
          const extension = path.extname(track.path);
          const defaultName = path.basename(track.path, extension);

          parseTrackInfoFromFile(track.path).then((data) => {
            data.title = data.title || defaultName;
            resolve({ data, token, url });
          }).catch((err) => {
            data = { title: defaultName };
            resolve({ data, token, url });
          });
        });

      }

      // load from url
      if (track.type === 'url') {

        return new Promise((resolve, reject) => {

          const url = track.url;
          const defaultName = decodeURIComponent(track.name.replace(/\.[^\.]+$/i, ''));

          parseTrackInfoFromNetEaseCloudMusic(track.id, defaultName).then((data) => {
            resolve({ data, token, url });
          }, reject);
        });

      }

      throw 'Unknow track type';
    },

    playTrackFrom(token) {
      this.loadTrackInfo(token)
        .then(this.playTrackByInfo.bind(this), console.error);
    },

    registerNextTrack(token) {
      this.loadTrackInfo(token).then((data) => {
        this.audioElement.onended = () => {
          this.playTrackByInfo(data);
        }
      }).catch((err) => {
        console.error(err);
        this.registerNextTrack(this.getNextTrackToken(token));
      });
    },

    getNextTrackToken(token) {
      return randomItem(Array.from(this.files.keys()));
    },

    playTrackByInfo({ data, buffer, token, url }) {
      this.playing = token;
      this.cssc.set('--album-cover', 'url(' + (data.cover || '/img/default-cover.svg') + ')');
      this.trackInfo = data;
      this.audioElement.src = url;
      this.registerNextTrack(this.getNextTrackToken(token));
    },

    removeTrack(token) {
      this.files.delete(token);
      this.$forceUpdate();
    },

    removeAll() {
      Array.from(this.files.keys()).forEach(this.removeTrack.bind(this));
    },

    getInfo() {
      this.analyser.getByteFrequencyData(this.frequency);
      const high = this.frequency.reduce((a, b) => a + b, 0) / (this.frequency.length * 255);
      return {
        frequency: this.frequency,
        trackInfo: this.trackInfo,
        duration: this.audioElement.duration,
        progress: this.audioElement.currentTime,
        high
      };
    },

    loadNetEaseCloudMusicPlayList(id) {
      backend.netease.playlist(id).then((res) => {
        res.playlist.tracks.map((track) => {
          this.addTrackFromUrl(
            `https://music.163.com/song/media/outer/url?id=${track.id}.mp3`,
            track.name, track.id);
        });
      }, (err) => {
        alert('Error loading playlist\nPlease try again or send issues to us.');
      });
    }
  }
});


