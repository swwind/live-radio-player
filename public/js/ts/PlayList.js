'use strict';

const fs = require('fs');

class PlayList {
  constructor() {
    this.elem = $('.play-list');
    this.files = new Map();
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = maxFftSize;
    this.analyser.smoothingTimeConstant = 0.1;
    this.frequency = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.connect(this.audioContext.destination);
    this.source = null;
    this.duration = NaN;
    this.startedTime = NaN;
    this.trackInfo = {};
    this.cssc = new CssController();
  }

  addTrackFromFile(file) {
    const token = randomToken(6);
    const item = { type: 'file', path: file.path, name: file.name };
    this.files.set(token, item);
    const elem = this._createItemElement(token, file.name);
    this.elem.appendChild(elem);
    return token;
  }

  addTrackFromUrl(url, name, id) {
    const token = randomToken(6);
    const item = { type: 'url', url, name, id };
    this.files.set(token, item);
    const elem = this._createItemElement(token, name);
    this.elem.appendChild(elem);
    return token;
  }

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
  }

  exportList() {
    return JSON.stringify(Array.from(this.files.values()));
  }

  _createItemElement(token, name) {
    const div = document.createElement('div');
    div.classList.add('list-item');
    div.setAttribute('id', token);
    div.appendChild(spanButton(name, name, (e) => {
      this.playTrack(token);
    }, 'flex1'));
    div.appendChild(spanButton('^', 'move up', (e) => {
      moveUpElement(e.target.parentNode);
    }));
    div.appendChild(spanButton('v', 'move down', (e) => {
      moveDownElement(e.target.parentNode);
    }));
    div.appendChild(spanButton('x', 'remove', (e) => {
      this.removeTrack(token);
    }));
    return div;
  }

  playTrack(token) {
    this.nextPlay && clearTimeout(this.nextPlay);
    this._prepareTrack(token)
      .then(this._playTrack.bind(this), console.error);
  }

  prepareToPlayTrack(token) {
    this._prepareTrack(token).then((data) => {
      this.nextPlay = setTimeout(() => {
        this._playTrack(data);
      }, (+ this.startedTime) + 1000 * this.duration - (new Date));
    }).catch((err) => {
      console.error(err);
      this.prepareToPlayTrack(this._getNextTrackToken(token));
    });
  }

  _decodeAudioData(data) {
    return new Promise((resolve, reject) => {
      this.audioContext.decodeAudioData(data, resolve, reject);
    });
  }

  _prepareTrack(token) {
    const track = this.files.get(token);

    if (!token) {
      return new Promise((resolve, reject) => reject('Token not found'));
    }

    // load from file
    if (track.type === 'file') {

      return new Promise((resolve, reject) => {

        let data = null, buffer = null;
        const filename = last(track.path.split('/'));
        const defaultName = filename.replace(/\.[^\.]+$/i, '');

        parseTrackInfo(track.path).then((_data) => {
          data = _data;
          data.title = data.title || defaultName;
          if (buffer) resolve({ data, buffer, token });
        }).catch((err) => {
          data = { title: defaultName };
          if (buffer) resolve({ data, buffer, token });
        });

        fs.readFile(track.path, (err, buf) => {
          this._decodeAudioData(buf.buffer).then((_buffer) => {
            buffer = _buffer;
            if (data) resolve({ data, buffer, token });
          }, reject);
        });

      });

    }

    // load from url
    if (track.type === 'url') {

      return new Promise((resolve, reject) => {

        let data = null, buffer = null;
        const defaultName = decodeURIComponent(track.name.replace(/\.[^\.]+$/i, ''));

        parseTrackInfoFromNetEaseCloudMusic(track.id, defaultName).then((_data) => {
          data = _data;
          if (buffer) resolve({ data, buffer, token });
        }, reject);

        backend.netease.postFile(track.url).then((e) => {
          this._decodeAudioData(e.buffer).then((_buffer) => {
            buffer = _buffer;
            if (data) resolve({ data, buffer, token });
          }, reject);
        }, reject);

      });

    }

    throw 'Unknow track type';
  }

  _playTrack({ data, buffer, token }) {
    $('.playing') && $('.playing').classList.remove('playing');
    $$(token).classList.add('playing');
    this.cssc.set('--album-cover', 'url(' + (data.cover || '/img/default-cover.svg') + ')');
    this.trackInfo = data;
    this.source && this.source.stop();
    this.source = this.audioContext.createBufferSource();
    this.source.connect(this.analyser);
    this.source.buffer = buffer;
    this.source.start(0);
    this.source.token = token;
    this.duration = buffer.duration;
    this.startedTime = new Date();
  }

  _getNextTrackToken(token) {
    const elem = $$(token);
    if (!elem || !elem.nextElementSibling) {
      return this.elem.firstChild.getAttribute('id');
    } else {
      return elem.nextElementSibling.getAttribute('id');
    }
  }

  removeTrack(token) {
    this.files.delete(token);
    $$(token) && $$(token).remove();
  }

  removeAll() {
    Array.from(this.files.keys()).forEach(this.removeTrack.bind(this));
  }

  getInfo() {
    this.analyser.getByteFrequencyData(this.frequency);
    const progress = (new Date() - this.startedTime) / 1000;
    const high = this.frequency.reduce((a, b) => a + b, 0) / (this.frequency.length * 255);
    if (this.duration - progress > 0 && this.source.token) {
      // prepare next
      this.prepareToPlayTrack(this._getNextTrackToken(this.source.token));
      this.source.token = null;
    }
    return {
      frequency: this.frequency,
      trackInfo: this.trackInfo,
      duration: this.duration,
      progress, high
    };
  }

  loadNetEaseCloudMusicPlayList(id) {
    backend.netease.playlist(id).then((res) => {
      const idmap = new Map();
      backend.netease.musicurl(res.playlist.tracks.map((track) => {
        idmap.set(track.id, track.name);
        return track.id;
      })).then((msg) => {
        msg.data.forEach(({ url, id }, i) => {
          this.addTrackFromUrl(url, idmap.get(id), id);
        });
      }, (err) => {
        alert('Error loading music\n' + err);
      });
    }, (err) => {
      alert('Error loading playlist\nPlease try again or send issue to us.');
    })
  }
}
