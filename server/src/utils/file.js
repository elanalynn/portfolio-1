const addHeaders = require('./addHeaders');
const ajax = {
  'http:': require('http'),
  'https:': require('https')
};
const fs = require('fs');
const { PHOTO_API } = process.env;
const url = require('url');

const fetch = (location, cb) => {
  const config = {
    ...url.parse(location),
    headers: addHeaders()
  };
  ajax[config.protocol || 'http:'].get(config, cb);
};

const streamFile = resource => {
  return new Promise((resolve, reject) => {
    const randomId = Math.floor(Math.random() * 5000);
    const filename = `/tmp/${Date.now()}-${randomId}.jpg`;
    const file = fs.createWriteStream(filename);
    file.on('open', () => {
      fetch(`${PHOTO_API}${resource}`, stream => stream.pipe(file));
    }).on('finish', () => resolve(filename)).on('error', reject);
  });
};

const sendFile = response => file => {
  return new Promise((resolve, reject) => {
    response.sendFile(file, err => {
      if (err) return reject(err);
      resolve(file);
    });
  });
};

module.exports = {
  sendFile,
  streamFile
};
