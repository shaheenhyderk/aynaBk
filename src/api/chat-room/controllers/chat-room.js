'use strict';

/**
 * chat-room controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::chat-room.chat-room', ({ strapi }) => ({
  // Override the default find method
  async find(ctx) {
    const { user } = ctx.state; // Strapi stores the authenticated user in ctx.state.user
    if (!user) {
      return ctx.badRequest('No authenticated user found');
    }

    // Use the core controller's find method and apply user filter
    // ctx.query = {
    //   ...ctx.query,
    //   populate: {
    //     users_permissions_user: true, // Populate this specific user field
    //   },
    // };

    ctx.query.filters = {
      ...ctx.query.filters,
      users_permissions_user: {
        id: user.id,
      },
    };

    ctx.query.sort = {
      ...ctx.query.sort,
      createdAt: 'asc',
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  // Override the default create method
  async create(ctx) {
    const { user } = ctx.state; // Strapi stores the authenticated user in ctx.state.user
    if (!user) {
      return ctx.badRequest('No authenticated user found');
    }

    // Add the user ID to the request body to associate the chat room with the current user
    ctx.request.body.data = {
      ...ctx.request.body.data,
      users_permissions_user: user.id,
    };

    // Use the core controller's create method
    return super.create(ctx);
  },
}));
