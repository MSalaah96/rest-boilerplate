const API_NAME = 'MY_API';

module.exports = {
  api: {
    name: API_NAME,
    version: '1.0',
    host: 'localhost',
    port: process.env.PORT || 8080,

    contextStoreName: 'api',
  },
  storage: {
    accessKey: '',
    secretKey: '',
    baseUrl: '',
    bucket: '',
    region: '',
    folder: '',
  },
  common: {
    pageSize: 10,
    maxPageSize: 100,
  },
  locales: {
    dataPath: `${__dirname}/locales`,
    dataExtension: '.json',
    supportedLocales: ['en', 'ar', 'none'],
  },
  authentication: {
    issuer: 'website.com',
    key: 'JWT_SECRET_HERE',
    expiration: 604800, // 7 Days
  },
  mongoDB: {
    url: `mongodb://localhost:27017/${API_NAME}`,
  },
};
