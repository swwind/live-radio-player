'use strict';

class PlayList {
  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add('play-list');
    this.files = new Map();
    this.elems = new Map();
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
    $('.tracks').appendChild(this.elem);
  }
  addTrack(file) {
    const token = md5(`${Math.random()}`).substr(0, 6);
    this.files.set(token, file);
    const elem = this._createItemElement(token, file);
    this.elems.set(token, elem);
    this.elem.appendChild(elem);
    return token;
  }
  _createItemElement(token, file) {
    const div = document.createElement('div');
    div.classList.add('list-item');
    div.setAttribute('id', token);
    div.appendChild(spanButton(file.name, file.name, (e) => {
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
    this._prepareTrack(token)
      .then(this._playTrack.bind(this), console.error);
  }
  prepareToPlayTrack(token) {
    this._prepareTrack(token).then((data) => {
      setTimeout(() => {
        this._playTrack(data);
      }, (+ this.startedTime) + 1000 * this.duration - (new Date));
    }).catch((err) => {
      console.error(err);
      this.prepareToPlayTrack(this._getNextTrack(token));
    });
  }
  _prepareTrack(token) {
    return new Promise((resolve, reject) => {
      const file = this.files.get(token);
      if (!file) reject('Could not find file with token: ' + token);
      let data = null, buffer = null;
      parseTrackInfo(file).then((_data) => {
        data = _data;
        data.title = data.title || decodeURIComponent(file.name.replace(/\.[^\.]+$/i, ''));
        if (buffer) resolve({ data, buffer, token });
      }).catch((err) => {
        data = { title: decodeURIComponent(file.name.replace(/\.[^\.]+$/i, '')) };
        if (buffer) resolve({ data, buffer, token });
      });
      const reader = new FileReader();
      reader.onload = (e) => {
        this.audioContext.decodeAudioData(e.target.result, (_buffer) => {
          buffer = _buffer;
          if (data) resolve({ data, buffer, token });
        }, reject);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
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
  _getNextTrack(token) {
    const elem = $$(token);
    if (!elem || !elem.nextElementSibling) {
      return this.elem.firstChild.getAttribute('id');
    } else {
      return elem.nextElementSibling.getAttribute('id');
    }
  }
  removeTrack(token) {
    this.files.delete(token);
    this.elems.get(token).remove();
    this.elems.delete(token);
  }
  getInfo() {
    this.analyser.getByteFrequencyData(this.frequency);
    const progress = (new Date() - this.startedTime) / 1000;
    const high = this.frequency.reduce((a, b) => a + b, 0) / (this.frequency.length * 255);
    if (this.duration - progress < 10 && this.source.token) {
      // less than 10s
      this.prepareToPlayTrack(this._getNextTrack(this.source.token));
      this.source.token = null;
    }
    return {
      frequency: this.frequency,
      trackInfo: this.trackInfo,
      duration: this.duration,
      progress, high
    };
  }
}
