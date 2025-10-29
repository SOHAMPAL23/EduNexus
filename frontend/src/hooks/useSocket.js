import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const useSocket = (courseId, user) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user || !courseId) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    // Create socket connection
    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
      setError(null);
      
      // Join the course room
      newSocket.emit('joinCourse', courseId);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Failed to connect to chat server');
      setConnected(false);
    });

    // Message event handlers
    newSocket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on('error', (err) => {
      console.error('Socket error:', err);
      setError(err.message || 'An error occurred');
    });

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.emit('leaveCourse', courseId);
        newSocket.disconnect();
      }
    };
  }, [courseId, user]);

  // Send message function
  const sendMessage = (content) => {
    if (!socket || !connected) {
      setError('Not connected to chat server');
      return;
    }

    if (!content || !content.trim()) {
      setError('Message cannot be empty');
      return;
    }

    socket.emit('sendMessage', {
      courseId,
      content: content.trim(),
    });
  };

  // Load previous messages
  const loadMessages = (previousMessages) => {
    setMessages(previousMessages);
  };

  // Clear messages
  const clearMessages = () => {
    setMessages([]);
  };

  return {
    socket,
    connected,
    messages,
    error,
    sendMessage,
    loadMessages,
    clearMessages,
  };
};