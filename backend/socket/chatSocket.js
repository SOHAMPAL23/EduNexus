const Message = require('../models/Message');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (io) => {
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }
      
      socket.user = user;
      next();
    } catch (error) {
      console.error('Socket auth error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.user.name, socket.id);

    socket.on('joinCourse', (courseId) => {
      socket.join(`course-${courseId}`);
      console.log(`📚 ${socket.user.name} joined course ${courseId}`);
    });

    socket.on('sendMessage', async (data) => {
      try {
        const { courseId, content } = data;
        
        console.log('💬 Message received:', { courseId, content, sender: socket.user.name });

        if (!content || !content.trim()) {
          socket.emit('error', { message: 'Message cannot be empty' });
          return;
        }

        const message = await Message.create({
          course: courseId,
          sender: socket.user._id,
          content: content.trim(),
        });

        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'name email');

        console.log('✅ Message saved and broadcasting:', populatedMessage);

        // ✅ FIX: Broadcast to everyone in the room (including sender)
        // This is correct because the sender also needs to see their message
        io.to(`course-${courseId}`).emit('newMessage', populatedMessage);

      } catch (error) {
        console.error('❌ Send message error:', error);
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('leaveCourse', (courseId) => {
      socket.leave(`course-${courseId}`);
      console.log(`👋 ${socket.user.name} left course ${courseId}`);
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.user.name, socket.id);
    });
  });
};