import Message from '../model/message.js';
import Channel from '../model/channel.js';

const typingUsers = {};

class SocketConnection {
  static init(io) {
    io.on('connection', (client) => {
      console.log('a user connected');
      // Listens for a new chat message
      client.on('newChannel', (name, description) => {
        // Create channel
        const newChannel = new Channel({
          name,
          description,
        });
        // Save it to database
        newChannel.save((err, channel) => {
          // Send message to those connected in the room
          console.log('new channel created');
          io.emit('channelCreated', channel.name, channel.description, channel.id);
        });
      });

      // Listens for user typing.
      client.on('startType', (userName, channelId) => {
        console.log(`User ${userName} is writing a message...`);
        typingUsers[userName] = channelId;
        io.emit('userTypingUpdate', typingUsers, channelId);
      });

      client.on('stopType', (userName) => {
        console.log(`User ${userName} has stopped writing a message...`);
        delete typingUsers[userName];
        io.emit('userTypingUpdate', typingUsers);
      });

      // Listens for a new chat message
      client.on('newMessage', (messageBody, userId, channelId, userName, userAvatar, userAvatarColor) => {
        // Create message

        console.log(messageBody);

        const newMessage = new Message({
          messageBody,
          userId,
          channelId,
          userName,
          userAvatar,
          userAvatarColor,
        });
        // Save it to database
        newMessage.save((err, msg) => {
          // Send message to those connected in the room
          console.log('new message sent');

          io.emit('messageCreated', msg.messageBody, msg.userId, msg.channelId, msg.userName, msg.userAvatar, msg.userAvatarColor, msg.id, msg.timeStamp);
        });
      });
    });
  }
}

export default SocketConnection;
