const { SUPPORTED_LANGUAGES } = require('../../../constants/languages');
module.exports = {
  idSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        pattern: '^[0-9a-fA-F]{24}$'
      }
    },
    required: ['id'],
    additionalProperties: false
  },
  userSchema: {
    type: 'object',
    properties: {
      first_name: { type: 'string' },
      last_name: { type: 'string' },
      description: { type: 'string' },
      translation: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            _lang: {
              type: 'string',
              enum: SUPPORTED_LANGUAGES
            },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            description: { type: 'string' }
          },
          required:['_lang']
        }
      },
      roles: { type: 'array' }
    },
    required: ['first_name', 'last_name', 'description','translation'],
    additionalProperties: false
  }
};
