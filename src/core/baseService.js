const _ = require('lodash');
const errors = require('../common/errors.js');
const utils = require('../common/utils');
const storage = require('./storage');
const crypto = require('../common/crypto');
const EVENTS = require('../constants/events');
const { ObjectId } = require('mongoose').Types;

class BaseService {
  constructor() {
    // Errors
    this.UnauthenticatedError = errors.UnauthenticatedError;
    this.UnauthorizedError = errors.UnauthorizedError;
    this.ValidationError = errors.ValidationError;
    this.NotFoundError = errors.NotFoundError;
    this.utils = utils;
    this.crypto = crypto;
    this.EVENTS = EVENTS;
    this.storage = storage;
    this.ObjectId = ObjectId;
  }
}

module.exports = BaseService;
