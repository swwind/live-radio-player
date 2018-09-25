'use strict';

const { spawn } = require('child_process');

let ffmpeg = null;

const startLive = (server, canvas, { onerror, fps, vbits, abits }) => {
  fps = fps || 30;
  vbits = vbits || 3 * 1024 * 1024;
  abits = abits || 44100;

  ffmpeg = spawn('ffmpeg', [
    '-i', '-',
    '-vcodec', 'copy',
    '-acodec', 'aac',
    '-f', 'flv',
    server
  ]);

  const mediaStream = canvas.captureStream(fps);

  const mediaRecorder = new MediaRecorder(mediaStream, {
    mimeType: 'video/webm;codecs=h264',
    audioBitsPerSecond: abits,
    videoBitsPerSecond: vbits
  });

  mediaRecorder.addEventListener('dataavailable', (e) => {
    new Response(e.data).arrayBuffer().then((data) => {
      ffmpeg.stdin.write(data);
    });
  });

  ffmpeg.on('close', (e) => {
    ffmpeg = null;
    mediaRecorder.stop();
    onerror && onerror(e);
  });
}

const stopLive = () => {
  ffmpeg && ffmpeg.kill('SIGKILL');
}

module.exports = {
  startLive,
  stopLive,
}
