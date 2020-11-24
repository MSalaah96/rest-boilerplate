const BaseController = require('../core/baseController');
const { userService } = require('../services');
const { aclResources } = require('../core/authorization/resources');
const { idSchema, userSchema } = require('../core/validation/schemas');

const multipart = {
  fileSize: 1 * 1024 * 1024,
  fields: {
    image: {
      maxCount: 1,
      ext: ['jpg', 'png']
    },
  }
};

class UsersController extends BaseController {
  constructor() {
    super({
      name: aclResources.USER,
      path: '/users',
      service: userService,
      routes: [
        {
          method: 'POST',
          path: '/',
          handler: 'create',
          multipart
        },
        {
          method: 'GET',
          path: '/:id',
          handler: 'findOne'
        },
        {
          method: 'GET',
          path: '/',
          handler: 'find'
        }
      ]
    });
  }

  async create(ctx) {
    await ctx.authorize(['createAny']);
    ctx.validate(userSchema, ctx.request.body);
    ctx.body = await this.service.create(ctx.request.body, ctx.request.files);
  }

  async findOne(ctx) {
    await ctx.authorize(['readAny']);
    ctx.body = await this.service.findById(ctx.params.id, ctx.request.query);
  }

  async find(ctx) {
    // await ctx.authorize(['readAny']);
    ctx.body = await this.service.find({}, ctx.request.query);
  }
}

module.exports = UsersController;
