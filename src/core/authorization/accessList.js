const { aclResources } = require('./resources');
const { roles } = require('./roles');
const aclRoles = {
  [roles.admin]: {
  },
  [roles.user]: {
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
