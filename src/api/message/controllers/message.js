'use strict';

/**
 * message controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::message.message', ({ strapi }) => ({
  // Custom controller method to fetch messages by chat room ID
  async findByChatRoom(ctx) {
    const { chatRoomId } = ctx.params; // Access the chatRoomId from URL parameters

    if (!chatRoomId) {
      return ctx.badRequest('Chat room ID must be provided');
    }

    // Fetch messages that belong to the specified chat room
    return await strapi.entityService.findMany('api::message.message', {
      filters: {chat_room: {id: chatRoomId}},
      sort: { createdAt: 'asc' }
    });
  },
}));
