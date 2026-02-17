import NodeCache from 'node-cache';

// Create cache instances with different TTLs
export const shortCache = new NodeCache({ stdTTL: 60 }); // 1 minute
export const mediumCache = new NodeCache({ stdTTL: 300 }); // 5 minutes  
export const longCache = new NodeCache({ stdTTL: 3600 }); // 1 hour

// Cache middleware factory
export const cacheMiddleware = (cache, keyGenerator, ttl) => {
  return (req, res, next) => {
    const key = keyGenerator(req);
    const cachedData = cache.get(key);

    if (cachedData) {
      console.log(`Cache hit for ${key}`);
      return res.json(cachedData);
    }

    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function(data) {
      if (res.statusCode === 200) {
        cache.set(key, data, ttl);
        console.log(`Cache set for ${key}`);
      }
      return originalJson.call(this, data);
    };

    next();
  };
};

// Cache key generators
export const cacheKeys = {
  userDashboard: (req) => `dashboard:${req.user._id}`,
  companyAnalytics: (req) => `analytics:company:${req.user._id}`,
  employeeProfile: (req) => `profile:employee:${req.params.id || req.user._id}`,
  reviews: (req) => `reviews:${req.params.employeeId || 'company'}:${JSON.stringify(req.query)}`,
  documents: (req) => `documents:${req.params.employeeId || 'company'}:${JSON.stringify(req.query)}`
};

// Cache invalidation utilities
export const invalidateCache = {
  userDashboard: (userId) => {
    shortCache.del(`dashboard:${userId}`);
    mediumCache.del(`analytics:company:${userId}`);
  },
  employeeProfile: (employeeId) => {
    shortCache.del(`profile:employee:${employeeId}`);
    mediumCache.del(`reviews:${employeeId}:*`);
    longCache.del(`documents:${employeeId}:*`);
  },
  companyData: (companyId) => {
    shortCache.del(`dashboard:${companyId}`);
    mediumCache.del(`analytics:company:${companyId}`);
    mediumCache.del(`reviews:company:*`);
    longCache.del(`documents:company:*`);
  }
};

// Memory usage monitoring
export const monitorCacheUsage = () => {
  setInterval(() => {
    console.log('Cache Stats:', {
      short: shortCache.getStats(),
      medium: mediumCache.getStats(),
      long: longCache.getStats()
    });
  }, 300000); // Every 5 minutes
};
