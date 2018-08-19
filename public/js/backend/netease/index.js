#!/bin/bash

const request = require('request');
const querystring = require('querystring');
const Encrypt = require('./crypto.js');

const ua = "Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36";
const cookie = require('./getCookie.js');

const sendRequest = (url, data) => {
  const cryptoreq = Encrypt(data);
  const options = {
    url: url,
    method: 'POST',
    headers: {
      Accept: "*/*",
      "Accept-Language": "zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4",
      Connection: "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      Referer: "http://music.163.com",
      Host: "music.163.com",
      Cookie: cookie,
      "User-Agent": ua
    },
    body: querystring.stringify({
      params: cryptoreq.params,
      encSecKey: cryptoreq.encSecKey
    })
  }
  return new Promise((resolve, reject) => {
    request(options, (error, res, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
}

const playlist = (id) => {
  const data = {
    id: id,
    n: 100000,
    s: 8,
    csrf_token: ""
  };
  return sendRequest('http://music.163.com/weapi/v3/playlist/detail', data);
}

const musicurl = (id) => {
  if (!Array.isArray(id)) {
    id = [id];
  }
  const data = {
    ids: id,
    br: 999000,
    csrf_token: ""
  };
  return sendRequest('http://music.163.com/weapi/song/enhance/player/url', data);
}

const musicinfo = (id) => {
  const data = {
    c: JSON.stringify([{ id }]),
    ids: "[" + id + "]",
    csrf_token: ""
  };
  return sendRequest('http://music.163.com/weapi/v3/song/detail', data);
}

module.exports = {
  playlist,
  musicurl,
  musicinfo
}
