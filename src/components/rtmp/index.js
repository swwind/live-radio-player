'use strict';

const { spawn } = require('child_process');

const Vue = require('../../dist/vue.min.js');
const template = require('./template.vue');

module.exports = (el, canvas) => new Vue({
  el, template,
  data: {
    living: false,
    server: '',
    fps: 30,
    vbits: 3000000,
    abits: 44100,
  },
  created() {
    this.ffmpeg = null;
  },
  methods: {
    startLive() {

      this.living = true;

      this.ffmpeg = spawn('ffmpeg', [
        '-i', '-',
        '-vcodec', 'copy',
        '-acodec', 'aac',
        '-f', 'flv',
        this.server
      ]);

      const mediaStream = canvas.captureStream(this.fps);

      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm;codecs=h264',
        audioBitsPerSecond: this.abits,
        videoBitsPerSecond: this.vbits
      });

      mediaRecorder.addEventListener('dataavailable', (e) => {
        new Response(e.data).arrayBuffer().then((data) => {
          this.ffmpeg.stdin.write(data);
        });
      });

      this.ffmpeg.on('close', (e) => {
        this.ffmpeg = null;
        this.living = false;
        mediaRecorder.stop();
      });
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
