import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

class WebSocketService {
  constructor() {
    this.wss = null;
    this.clients = new Map(); // userId -> WebSocket connection
    this.rooms = new Map(); // roomName -> Set of userIds
  }

  initialize(server) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws',
      verifyClient: this.verifyClient.bind(this)
    });

    this.wss.on('connection', this.handleConnection.bind(this));
    console.log('WebSocket server initialized');
  }

  async verifyClient(info) {
    try {
      const url = new URL(info.req.url, 'http://localhost');
      const token = url.searchParams.get('token');

      if (!token) {
        return false;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return false;
      }

      info.req.user = user;
      return true;
    } catch (error) {
      console.error('WebSocket verification failed:', error);
      return false;
    }
  }

  handleConnection(ws, req) {
    const user = req.user;
    const userId = user._id.toString();

    console.log(`WebSocket client connected: ${user.email} (${userId})`);

    // Store client connection
    this.clients.set(userId, {
      ws,
      user,
      connectedAt: new Date()
    });

    // Add user to their role-based room
    this.addToRoom(user.role, userId);

    // Send welcome message
    this.sendToUser(userId, {
      type: 'connection',
      data: {
        message: 'Connected to real-time updates',
        userId,
        role: user.role
      }
    });

    // Handle messages from client
    ws.on('message', (data) => {
      this.handleMessage(userId, data);
    });

    // Handle disconnection
    ws.on('close', () => {
      this.handleDisconnection(userId);
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error(`WebSocket error for user ${userId}:`, error);
      this.handleDisconnection(userId);
    });
  }

  handleMessage(userId, data) {
    try {
      const message = JSON.parse(data);
      const client = this.clients.get(userId);

      if (!client) return;

      console.log(`Message from ${userId}:`, message);

      // Handle different message types
      switch (message.type) {
        case 'ping':
          this.sendToUser(userId, { type: 'pong' });
          break;

        case 'join_room':
          this.addToRoom(message.data.room, userId);
          break;

        case 'leave_room':
          this.removeFromRoom(message.data.room, userId);
          break;

        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  handleDisconnection(userId) {
    console.log(`WebSocket client disconnected: ${userId}`);
    
    const client = this.clients.get(userId);
    if (client) {
      // Remove from all rooms
      this.rooms.forEach((members, roomName) => {
        if (members.has(userId)) {
          this.removeFromRoom(roomName, userId);
        }
      });

      // Remove client
      this.clients.delete(userId);
    }
  }

  addToRoom(roomName, userId) {
    if (!this.rooms.has(roomName)) {
      this.rooms.set(roomName, new Set());
    }
    this.rooms.get(roomName).add(userId);
    console.log(`User ${userId} joined room: ${roomName}`);
  }

  removeFromRoom(roomName, userId) {
    if (this.rooms.has(roomName)) {
      this.rooms.get(roomName).delete(userId);
      
      // Clean up empty rooms
      if (this.rooms.get(roomName).size === 0) {
        this.rooms.delete(roomName);
      }
    }
    console.log(`User ${userId} left room: ${roomName}`);
  }

  sendToUser(userId, message) {
    const client = this.clients.get(userId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error(`Error sending message to user ${userId}:`, error);
      }
    }
  }

  sendToRoom(roomName, message, excludeUserId = null) {
    const members = this.rooms.get(roomName);
    if (!members) return;

    members.forEach(userId => {
      if (userId !== excludeUserId) {
        this.sendToUser(userId, message);
      }
    });
  }

  sendToRole(role, message) {
    this.clients.forEach((client, userId) => {
      if (client.user.role === role) {
        this.sendToUser(userId, message);
      }
    });
  }

  broadcast(message, excludeUserId = null) {
    this.clients.forEach((client, userId) => {
      if (userId !== excludeUserId) {
        this.sendToUser(userId, message);
      }
    });
  }

  // Notification methods
  sendNotification(userId, notification) {
    this.sendToUser(userId, {
      type: 'notification',
      data: {
        ...notification,
        timestamp: new Date().toISOString()
      }
    });
  }

  sendNotificationToRole(role, notification) {
    this.sendToRole(role, {
      type: 'notification',
      data: {
        ...notification,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Review updates
  sendReviewUpdate(employeeId, update) {
    this.sendToRoom(`employee_${employeeId}`, {
      type: 'review_update',
      data: {
        employeeId,
        ...update,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Document verification updates
  sendDocumentUpdate(employeeId, update) {
    this.sendToRoom(`employee_${employeeId}`, {
      type: 'document_verification',
      data: {
        employeeId,
        ...update,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Employee status updates
  sendEmployeeStatusUpdate(employeeId, status) {
    this.sendToRoom(`employee_${employeeId}`, {
      type: 'employee_status',
      data: {
        employeeId,
        status,
        timestamp: new Date().toISOString()
      }
    });
  }

  getStats() {
    return {
      connectedClients: this.clients.size,
      rooms: Array.from(this.rooms.entries()).map(([name, members]) => ({
        name,
        memberCount: members.size
      }))
    };
  }
}

export default new WebSocketService();