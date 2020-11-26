const { aclResources } = require('./resources');
const { roles } = require('./roles');
const aclRoles = {
  [roles.admin]: {},
  [roles.user]: {},
  public: {}
};

module.exports = {
  aclResources,
  aclRoles
};
