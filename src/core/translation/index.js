const _ = require('lodash');

/**
 {
  "name": "Mohammed Salah",
  "address": "Mhawlat",
  "translation": [
    {
      "_lang": "ar",
      "name": "محمد",
      "address": "محولات"
    }
  ]
}
 */
class Translation {
  translate(ctx) {
    const language = _.get(ctx, '_locals.locale', 'en');
    if (language === 'none') {
      return;
    }
    ctx.response.body = this.toLanguage(JSON.parse(JSON.stringify(_.get(ctx, 'response.body', {}))), language);
  }

  toLanguage(data, language) {
    if (_.isNil(data) || !_.isObject(data)) {
      return data;
    }
    if (data.translation) {
      const translationObject = data.translation.find((element) => element._lang === language);
      if (translationObject) {
        _.merge(data, translationObject);
      }
    }
    delete data.translation;
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      data[keys[i]] = this.toLanguage(data[keys[i]], language);
    }
    return data;
  }
}

module.exports = new Translation();
