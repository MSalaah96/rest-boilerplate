const _ = require('lodash');
const BaseService = require('../core/baseService.js');
const { User } = require('../database/mongo/models');

class UserService extends BaseService {
  async create(data, files) {
    if (files && files.image) {
      data.image = (await this.storage.save(files.image))[0];
    }
    User.create(data).then(function (user) {
      global.Api.events.publish('users', 'created', user);
      return user;
    });
  }

  async findById(id, params) {
    throw new Error('this function needs to be implemented');
  }

  async find(params) {
    const query = {};
    const nParams = params;
    if (params.search) {
      query.$text = { $search: query.search };
    }
    if (params.populate) {
    }
    const result = await User.getAll(query, nParams);
    return result;
  }
}

module.exports = new UserService();
