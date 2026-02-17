import crypto from 'crypto';

class CSRFProtection {
  constructor() {
    this.tokens = new Map(); // sessionId -> token
    this.tokenExpiry = new Map(); // sessionId -> expiry time
    this.cleanupInterval = null;
    this.tokenLifetime = 60 * 60 * 1000; // 1 hour
  }

  initialize() {
    // Clean up expired tokens every 15 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredTokens();
    }, 15 * 60 * 1000);
  }

  generateToken(sessionId) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + this.tokenLifetime;

    this.tokens.set(sessionId, token);
    this.tokenExpiry.set(sessionId, expiry);

    return token;
  }

  validateToken(sessionId, token) {
    const storedToken = this.tokens.get(sessionId);
    const expiry = this.tokenExpiry.get(sessionId);

    if (!storedToken || !expiry) {
      return false;
    }

    if (Date.now() > expiry) {
      this.removeToken(sessionId);
      return false;
    }

    return crypto.timingSafeEqual(
      Buffer.from(storedToken, 'hex'),
      Buffer.from(token, 'hex')
    );
  }

  removeToken(sessionId) {
    this.tokens.delete(sessionId);
    this.tokenExpiry.delete(sessionId);
  }

  cleanupExpiredTokens() {
    const now = Date.now();
    for (const [sessionId, expiry] of this.tokenExpiry.entries()) {
      if (now > expiry) {
        this.removeToken(sessionId);
      }
    }
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.tokens.clear();
    this.tokenExpiry.clear();
  }
}

export default new CSRFProtection();
