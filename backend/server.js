require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const fileUpload = require('express-fileupload');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Connect Database
connectDB();

// CRITICAL: Middleware ORDER matters!
app.use(cors());

// File upload MUST come BEFORE express.json() and urlencoded()
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  abortOnLimit: true,
  parseNested: true,
  debug: process.env.NODE_ENV === 'development'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route to verify file upload works
app.post('/api/test-upload', (req, res) => {
  console.log('Test upload - Body:', req.body);
  console.log('Test upload - Files:', req.files);
  res.json({ 
    body: req.body, 
    files: req.files ? Object.keys(req.files) : [] 
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/lectures', require('./routes/lectures'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/chat', require('./routes/chat'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'EduNexus API is running'
  });
});

// Socket.io for Chat
require('./socket/chatSocket')(io);

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL}`);
});

module.exports = { app, server };