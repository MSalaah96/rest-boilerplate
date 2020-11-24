const { aclResources } = require('./resources');
const { roles } = require('./roles');
const aclRoles = {
  [roles.admin]: {
    [aclResources.USER]: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    }
  },
  [roles.user]: {
    [aclResources.USER]: {
      'create:any': ['*', '!blocked', '!password'],
      'read:any': ['*', '!password', '!details.code']
    }
  },
  public: {
    [aclResources.USER]: {
      'read:any': ['*'],
      'create:any': ['*']
    }
  }
};

module.exports = {
  aclResources,
  aclRoles
};
