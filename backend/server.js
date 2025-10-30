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
    origin: process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
  }
});

// Connect Database
connectDB();

// CRITICAL: Middleware ORDER matters!
app.use(cors({
  origin: process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Create a file upload middleware that we can apply selectively
const fileUploadMiddleware = fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  abortOnLimit: true,
  parseNested: true,
  debug: process.env.NODE_ENV === 'development'
});

// Apply file upload middleware only to routes that need it
// We'll apply it in the specific route files instead of globally

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route to verify file upload works
app.post('/api/test-upload', fileUploadMiddleware, (req, res) => {
  console.log('Test upload - Body:', req.body);
  console.log('Test upload - Files:', req.files);
  res.json({ 
    body: req.body, 
    files: req.files ? Object.keys(req.files) : [] 
  });
});

// Routes - apply file upload middleware only where needed
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', fileUploadMiddleware, require('./routes/courses'));
app.use('/api/lectures', fileUploadMiddleware, require('./routes/lectures'));
app.use('/api/assignments', fileUploadMiddleware, require('./routes/assignments'));
app.use('/api/submissions', fileUploadMiddleware, require('./routes/submissions'));
app.use('/api/admin', fileUploadMiddleware, require('./routes/admin'));
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

let PORT = parseInt(process.env.PORT, 10) || 5001;

const startServer = (port) => {
  server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Client URL: ${process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  });
};

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`⚠️ Port ${PORT} in use, trying ${PORT + 1}...`);
    PORT += 1;
    setTimeout(() => startServer(PORT), 250);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

startServer(PORT);

module.exports = { app, server };