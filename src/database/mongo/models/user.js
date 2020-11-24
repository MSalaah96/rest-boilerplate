const mongoose = require('mongoose');
const { Schema } = mongoose;
const { rolesEnum } = require('../../../core/authorization/accessList');
const { SUPPORTED_LANGUAGES } = require('../../../constants/languages');
const translationSchema = new Schema(
  {
    _lang: {
      type: String,
      enum: SUPPORTED_LANGUAGES
    },
    first_name: {
      type: String,
      trim: true
    },
    last_name: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);
const userSchema = new Schema({
  first_name: {
    type: String,
    trim: true
  },
  last_name: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  translation: [translationSchema],
  image: {
    type: String,
    trim: true
  },
  roles: [
    {
      type: String,
      enum: rolesEnum
    }
  ]
});
userSchema.index(
  {
    first_name: 'text',
    last_name: 'text',
    description: 'text',
    'translation.first_name': 'text',
    'translation.last_name': 'text',
    'translation.description': 'text'
  },
  {
    name: 'search',
    default_language: 'none'
  }
);

module.exports = mongoose.model('User', userSchema);
