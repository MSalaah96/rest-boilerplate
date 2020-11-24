const logger = require('./logger');
const events = require('./events');

module.exports = [
    { name: 'log', obj: logger },
    { name: 'events', obj: events },
];
