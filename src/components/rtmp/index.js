'use strict';

const { spawn } = require('child_process');
const blob2buffer = require('blob-to-buffer');

const Vue = require('../../dist/vue.min.js');
const template = require('./template.vue');

module.exports = (el, canvas, audio) => new Vue({
  el, template,
  data: {
    living: false,
    server: 'rtmp://10.176.20.48:1935/live/video',
    fps: 30,
    vbits: 3000000,
    abits: 44100,
  },
  created() {
    this.ffmpeg = null;
  },
  methods: {
    startLive() {

      this.ffmpeg = spawn('ffmpeg', [
        '-i', '-',
        '-vcodec', 'copy',
        '-acodec', 'aac',
        '-f', 'flv',
        this.server
      ]);

      const mediaStream = new MediaStream();
      canvas.captureStream(this.fps).getTracks().forEach(mediaStream.addTrack.bind(mediaStream));
      audio.getTracks().forEach(mediaStream.addTrack.bind(mediaStream));

      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm;codecs=h264',
        videoBitsPerSecond: this.vbits,
        audioBitsPerSecond: this.abits,
      });

      mediaRecorder.addEventListener('dataavailable', (e) => {
        blob2buffer(e.data, (err, buffer) => {
          !err && this.ffmpeg.stdin.write(buffer);
        });
      });

      mediaRecorder.start(1000);

      this.ffmpeg.on('close', (e) => {
        this.ffmpeg = null;
        this.living = false;
        mediaRecorder.stop();
      });

      this.living = true;
    },

    stopLive() {
      this.ffmpeg && this.ffmpeg.kill('SIGKILL');
    },

    handleClick(e) {
      if (this.living) {
        this.stopLive();
      } else {
        this.startLive();
      }
    }
  }
})
