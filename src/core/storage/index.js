const _ = require('lodash');
const path = require('path');
const config = require('../../config');
const AWS = require('aws-sdk');
const uniqid = require('uniqid');
const mime = require('mime-types');

class Storage {
  constructor() {
    const spacesEndpoint = new AWS.Endpoint(`${config.storage.region}.${config.storage.baseUrl}`);
    AWS.config.update({
      correctClockSkew: true,
    });

    this.s3 = new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: config.storage.accessKey,
      secretAccessKey: config.storage.secretKey,
    });
  }

  getPublicUrl(fileName) {}

  async upload(file) {
    const ext = path.extname(file.originalname);
    return await new Promise((resolve, reject) => {
      const key = `${config.storage.folder}/${uniqid()}${ext}`;
      const params = {
        Bucket: config.storage.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: mime.lookup(ext),
        ContentLength: file.size,
        ACL: 'public-read',
      };
      const options = {
        partSize: 10 * 1024 * 1024, // 10 MB
        queueSize: 10,
      };
      this.s3.upload(params, options, function (err, data) {
        if (!err) {
          resolve(data.Location); // successful response
        } else {
          reject(err); // an error occurred
        }
      });
    });
  }

  async delete(urls) {
    let rFiles = urls;
    if (_.isNil(urls)) {
      return;
    }
    if (!_.isArray(urls)) {
      rFiles = [urls];
    }
    const tasks = [];
    for (let i = 0; i < rFiles.length; i++) {
      const file = rFiles[i];
      tasks.push(this.remove(file));
    }
    return await Promise.all(tasks);
  }

  async remove(url) {
    return await new Promise((resolve, reject) => {
      const key = Storage._getKeyFromUrl(url);
      const params = {
        Bucket: config.storage.bucket,
        Key: key,
      };
      this.s3.deleteObject(params, function (err, data) {
        if (!err) {
          resolve(data);
        } else {
          console.log(err);
          reject(err);
        }
      });
    });
  }

  async save(files) {
    let rFiles = files;
    if (_.isNil(files)) {
      return;
    }
    if (!_.isArray(files)) {
      rFiles = [files];
    }
    const tasks = [];
    for (let i = 0; i < rFiles.length; i++) {
      const file = rFiles[i];
      tasks.push(this.upload(file));
    }
    return await Promise.all(tasks);
  }

  static _getKeyFromUrl(url) {
    const key = new URL(url).pathname;
    return key.substring(1, key.length);
  }
}

module.exports = new Storage();
