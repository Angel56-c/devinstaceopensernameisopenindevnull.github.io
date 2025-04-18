const Message = require('./models/Message');
const User = require('./models/User');

module.exports = function(io) {
  let usersOnline = 0;

  io.on('connection', (socket) => {
    console.log('New client connected');
    usersOnline++;
    io.emit('users online', usersOnline);

    // Load previous messages
    socket.on('load messages', async () => {
      try {
        const messages = await Message.find()
          .sort({ createdAt: -1 })
          .limit(50)
          .populate('user', 'username');
        socket.emit('messages loaded', messages.reverse());
      } catch (err) {
        console.error('Error loading messages:', err);
      }
    });

    // Handle new message
    socket.on('new message', async (data) => {
      try {
        const user = await User.findById(data.userId);
        if (!user) return;

        const message = new Message({
          user: user._id,
          username: user.username,
          content: data.content
        });

        await message.save();

        io.emit('message received', {
          username: user.username,
          content: data.content,
          createdAt: message.createdAt
        });
      } catch (err) {
        console.error('Error saving message:', err);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected');
      usersOnline--;
      io.emit('users online', usersOnline);
    });
  });
};