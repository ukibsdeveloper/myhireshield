import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeout = useRef(null);

  const connect = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const wsUrl = process.env.NODE_ENV === 'production' 
      ? `wss://myhireshield.com/ws?token=${token}`
      : `ws://localhost:5000/ws?token=${token}`;

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);
        setSocket(ws);
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessages(prev => [...prev, data]);
          
          // Handle different message types
          handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setConnected(false);
        setSocket(null);

        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.pow(2, reconnectAttempts.current) * 1000; // Exponential backoff
          reconnectTimeout.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnected(false);
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
    }
  };

  const disconnect = () => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
    if (socket) {
      socket.close();
    }
  };

  const sendMessage = (type, data) => {
    if (socket && connected) {
      const message = {
        type,
        data,
        timestamp: new Date().toISOString()
      };
      socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected');
    }
  };

  const handleMessage = (message) => {
    switch (message.type) {
      case 'notification':
        // Handle real-time notifications
        if (message.data.level === 'error') {
          // Show error toast
        } else if (message.data.level === 'success') {
          // Show success toast
        } else {
          // Show info toast
        }
        break;
      
      case 'review_update':
        // Handle review status updates
        break;
      
      case 'document_verification':
        // Handle document verification updates
        break;
      
      case 'employee_status':
        // Handle employee status changes
        break;
      
      default:
        console.log('Unknown message type:', message.type);
    }
  };

  useEffect(() => {
    // Connect when component mounts
    connect();

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, []);

  const value = {
    socket,
    connected,
    messages,
    sendMessage,
    connect,
    disconnect
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
