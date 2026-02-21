# VPS Setup & Login/Signup Fix Guide

## 🔴 Problem Summary
Login aur Signup fail ho raha hai with error: "Authentication Protocol Failed" aur "Registration failed"

## ✅ What We Fixed (Local)
1. **API Error Handling**: Added better logging for debugging
2. **CORS Configuration**: Expanded allowed origins to include all domain variations
3. **Diagnostic Endpoint**: Added `/api/diagnose` to test API connectivity
4. **Error Messages**: Improved server-side error logging

---

## 🚀 VPS Deployment Checklist

### Step 1: Pull Latest Changes
```bash
cd /path/to/myhireshield
git pull origin main
```

### Step 2: Check Backend Environment File
**Location**: `/path/to/myhireshield/server/.env`

**Ensure these variables are set correctly:**

```env
# Must Match Your VPS Domain
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://myhireshield.com
PRODUCTION_URL=https://myhireshield.com
CORS_ORIGIN=https://myhireshield.com

# Database Connection (CRITICAL)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/myhireshield?retryWrites=true&w=majority

# JWT Secret (MUST BE STRONG - same as before if already running)
JWT_SECRET=your-production-secret-key-32-characters-minimum

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Step 3: Test API Connectivity

Open browser and test these URLs:

#### Test 1: Basic Health Check
```
https://myhireshield.com/api/health
```
**Expected Response:**
```json
{
  "success": true,
  "message": "MyHireShield API is active",
  "environment": "production"
}
```

#### Test 2: Diagnostic Endpoint
```
https://myhireshield.com/api/diagnose
```
**Shows Frontend URL configuration, CORS settings, etc.**

### Step 4: Browser Developer Tools (F12)
Open Network tab and try login:
1. Look for failed requests to `/api/auth/login`
2. Check the response status:
   - **200**: Success (but might have business logic error)
   - **400**: Bad request (missing email/password/role)
   - **401**: Unauthorized (credentials invalid)
   - **403**: Forbidden (CORS or permission issue)
   - **500**: Server error (check VPS logs)

### Step 5: Check Client Environment File
**Location**: `/path/to/myhireshield/client/.env.production`

**Must have:**
```env
VITE_API_URL=https://myhireshield.com/api
VITE_APP_NAME=MyHireShield
```

**Rebuild Frontend:**
```bash
cd client
npm run build
```

### Step 6: Restart Node Server
```bash
# Kill existing process
pkill -f "node.*server.js"

# Or if using PM2
pm2 restart myhireshield

# Start fresh
cd server
npm start
```

### Step 7: Check VPS Logs

**Real-time logs:**
```bash
# See console output
tail -f /path/to/myhireshield/server/logs.txt

# Or if using PM2
pm2 logs myhireshield
```

**Look for these messages:**
- ✅ `✅ MongoDB Connected` - Database is connected
- ✅ `🚀 MyHireShield Server Running` - Backend started successfully
- ✅ `✅ CORS: Allowing origin https://myhireshield.com` - CORS is working
- ❌ Any error messages show the actual problem

---

## 🔧 Troubleshooting

### Issue: "Network error. Check your connection."
**Cause**: Frontend can't reach backend API
**Fix**:
1. Check if backend is running: `curl https://myhireshield.com/api/health`
2. Check VITE_API_URL in client .env.production is correct
3. Check firewall allows port 5000 (or whatever port backend is on)

### Issue: "Authentication Protocol Failed" (500 error)
**Cause**: Backend error, likely MongoDB or JWT issue
**Fix**:
1. Check `MONGODB_URI` in server `.env` - Test connection string
2. Check `JWT_SECRET` hasn't changed
3. Check server logs: `pm2 logs myhireshield`

### Issue: "CORS policy violation"
**Cause**: Frontend domain not in CORS allowed origins
**Fix**:
1. Update `FRONTEND_URL`, `PRODUCTION_URL`, `CORS_ORIGIN` in server `.env`
2. Add domain variations:
   - https://myhireshield.com
   - https://www.myhireshield.com
   - http://myhireshield.com (if using HTTP during dev)

### Issue: "Email already registered" when trying signup
**Cause**: Email exists in database from previous attempt
**Fix**:
```bash
# Connect to MongoDB and delete the incomplete user
# Or contact admin to manually clean up
```

---

## 📊 Testing Login/Signup Flow

### Test with cURL
```bash
# Test Login
curl -X POST https://myhireshield.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@company.com","password":"Test123!","role":"company"}'

# Test Company Registration
curl -X POST https://myhireshield.com/api/auth/register/company \
  -H "Content-Type: application/json" \
  -d '{
    "companyName":"Test Company",
    "email":"test2@company.com",
    "password":"Test123!",
    "industry":"IT",
    "companySize":"50-100",
    "website":"https://example.com"
  }'
```

---

## 🔄 Deployment Process

1. **Pull changes**: `git pull origin main`
2. **Update dependencies**: `npm install` (in both client and server)
3. **Check .env files**: Verify all production values
4. **Build frontend**: `npm run build` (in client)
5. **Restart backend**: Kill old process, start new one
6. **Test endpoints**: Verify `/api/health` and `/api/diagnose`
7. **Test login/signup**: Try with browser

---

## 📞 If Still Not Working

1. **Check Browser Console** (F12):
   - Look for red errors
   - See full error message

2. **Check VPS SSH Logs**:
   - Backend errors show here
   - Database connection issues appear here

3. **Run Diagnostic**:
   ```bash
   # In VPS terminal
   curl https://myhireshield.com/api/diagnose | jq .
   ```

4. **Share Output**:
   - Browser console error
   - VPS backend log output
   - Diagnostic endpoint response

---

Generated: 2026-02-21
Status: All fixes implemented locally ✅
Next Step: Deploy to VPS and verify
