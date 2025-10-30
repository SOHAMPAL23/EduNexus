import { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AuthContext } from '../../context/AuthContext';
import { chatAPI } from '../../services/api';

const ChatRoom = () => {
  const { courseId } = useParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user || !courseId) return;

    fetchMessages();
    initSocket();

    return () => {
      if (socket) {
        socket.emit('leaveCourse', courseId);
        socket.disconnect();
      }
    };
  }, [courseId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data } = await chatAPI.getMessages(courseId);
      console.log('Fetched messages:', data);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const initSocket = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No token found');
      return;
    }

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    console.log('Connecting to socket:', SOCKET_URL);

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 500,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setConnected(true);
      newSocket.emit('joinCourse', courseId);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });

    // ✅ FIX: Only add message when received from server
    newSocket.on('newMessage', (message) => {
      console.log('📨 New message received:', message);
      setMessages((prev) => {
        // ✅ Prevent duplicates by checking if message already exists
        const exists = prev.some(m => m._id === message._id);
        if (exists) {
          console.log('⚠️ Duplicate message detected, skipping');
          return prev;
        }
        return [...prev, message];
      });
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      return;
    }

    if (!socket || !connected) {
      alert('Not connected to chat server. Please refresh the page.');
      return;
    }

    console.log('Sending message:', { courseId, content: newMessage });

    // ✅ FIX: Just emit the message, DON'T add it to state here
    // The server will broadcast it back to everyone including us
    socket.emit('sendMessage', {
      courseId,
      content: newMessage.trim(),
    });

    // ✅ Clear input immediately
    setNewMessage('');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please login to access chat</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '70vh' }}>
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Course Chat</h2>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-sm">{connected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>

          <div className="flex flex-col" style={{ height: 'calc(70vh - 64px)' }}>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender._id === user._id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-xs mb-1 opacity-75 font-semibold">{msg.sender.name}</p>
                      <p className="break-words">{msg.content}</p>
                      <p className="text-xs mt-1 opacity-75">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="border-t p-4 flex gap-2 bg-white">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={connected ? "Type a message..." : "Connecting..."}
                disabled={!connected}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={!connected || !newMessage.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;