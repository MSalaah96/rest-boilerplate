const _ = require('lodash');
const errors = require('../common/errors.js');
const utils = require('../common/utils');
const storage = require('./storage');
const crypto = require('../common/crypto');

class BaseService {
  constructor() {
    // Errors
    this.UnauthenticatedError = errors.UnauthenticatedError;
    this.UnauthorizedError = errors.UnauthorizedError;
    this.ValidationError = errors.ValidationError;
    this.NotFoundError = errors.NotFoundError;
    this.utils = utils;
    this.crypto = crypto;
    this.storage = storage;
  }
}

module.exports = BaseService;
