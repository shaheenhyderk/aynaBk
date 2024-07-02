'use strict';

/**
 * message router
 */

// const {createCoreRouter} = require('@strapi/strapi').factories;
//
// module.exports = createCoreRouter('api::message.message', {
//   config: {
//     // Define your custom route for fetching messages by chat room ID
//     findByChatRoom: {
//       method: 'GET',
//       path: '/api/messages/:chatRoomId', // This will be the route path
//       handler: 'message.findByChatRoom', // Points to a method in your message controller
//       config: {
//         auth: true,
//         policies: [], // You can specify additional policies here if needed
//       },
//     },
//   },
// });

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/messages/chatroom/:chatRoomId', // This will be the route path
      handler: 'message.findByChatRoom', // Points to a method in your message controller
    },
  ],
};
