const { USERS } = require('../../../constants/events');
// Handlers
const onUserCreated = require('./userCreated');
const onUserUpdated = require('./userUpdated');

class UsersHandlers {
  initialize() {
    const { CHANNEL, TOPICS } = USERS;
    // eslint-disable-next-line no-undef
    Api.events.subscribeMany([
      {
        channel: CHANNEL,
        topic: TOPICS.CREATED,
        callback: onUserCreated
      },
      {
        channel: CHANNEL,
        topic: TOPICS.UPDATED,
        callback: onUserUpdated
      }
    ]);
  }
}

module.exports = new UsersHandlers();
