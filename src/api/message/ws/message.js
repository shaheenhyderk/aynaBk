'use strict';

/**
 * message ws events
 */

const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const url = require('url');

module.exports = function setupWebSocket(server) {
  const wss = new WebSocket.Server({noServer: true});

  server.on('upgrade', async (request, socket, head) => {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // Extract chatRoomId from the URL
    const match = pathname.match(/^\/ws\/message\/(\d+)$/);

    if (match) {
      const chatRoomId = match[1];

      // Extract the token from the query parameters
      const authParam = query.Authorization;
      if (!authParam || !authParam.startsWith('Bearer ')) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      const token = authParam.slice(7); // Remove 'Bearer ' prefix
      if (!token) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      try {
        // Validate the token
        const decodedToken = jwt.verify(token, strapi.config.get('plugin.users-permissions.jwtSecret'));

        // If token is valid, proceed with WebSocket connection
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request, chatRoomId, decodedToken);
        });
      } catch (error) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
      }
    } else {
      socket.destroy();
    }
  });

  wss.on('connection', (ws, request, chatRoomId) => {
    console.log(`Connected to message WebSocket for chat room ID: ${chatRoomId}`);

    ws.on('message', async (data) => {
      const content = JSON.parse(data.toString()).content;

      try {
        // Save incoming message from user
        const userMessage = await strapi.entityService.create('api::message.message', {
          data: {
            content,
            chat_room: chatRoomId,
            sender_type: 'USER',
          }
        });

        // Send the created message object back through the WebSocket
        ws.send(JSON.stringify(userMessage));

        // Optionally save system echo message
        const systemMessage = await strapi.entityService.create('api::message.message', {
          data: {
            content,  // System echo message
            chat_room: chatRoomId,
            sender_type: 'SYSTEM',
          }
        });

        // Send the created system echo message object back through the WebSocket
        ws.send(JSON.stringify(systemMessage));
      } catch (error) {
        console.error('Error saving message:', error);
        ws.send(JSON.stringify({error: 'Failed to save message'}));
      }
    });


    ws.on('close', () => {
      console.log(`WebSocket connection closed for chat room ID: ${chatRoomId}`);
    });
  });

  return wss;
};
