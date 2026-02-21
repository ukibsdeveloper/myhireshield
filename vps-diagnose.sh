#!/bin/bash
# VPS Troubleshooting Script
# Run this on VPS to diagnose the 502 Bad Gateway issue

echo "=================================="
echo "🔍 MyHireShield VPS Diagnostics"
echo "=================================="
echo ""

# 1. Check if Node process is running
echo "📋 [1] Checking if Node.js server is running..."
ps aux | grep -E "node|npm" | grep -v grep
echo ""

# 2. Check if PM2 is running
echo "📋 [2] Checking PM2 status..."
pm2 list 2>/dev/null || echo "⚠️  PM2 not installed or not running"
echo ""

# 3. Find .env file
echo "📋 [3] Looking for .env files..."
find / -name ".env" -type f 2>/dev/null | head -20
echo ""

# 4. Check backend directory structure
echo "📋 [4] Checking project structure..."
if [ -d "/app/myhireshield" ]; then
    echo "✅ Found: /app/myhireshield"
    ls -la /app/myhireshield/
elif [ -d "/home/*/myhireshield" ]; then
    echo "✅ Found: $(find /home -name myhireshield -type d 2>/dev/null)"
    ls -la $(find /home -name myhireshield -type d 2>/dev/null | head -1)
elif [ -d "/root/myhireshield" ]; then
    echo "✅ Found: /root/myhireshield"
    ls -la /root/myhireshield/
else
    echo "❌ Project directory not found"
fi
echo ""

# 5. Check if port 5000 is listening
echo "📋 [5] Checking if backend port 5000 is listening..."
netstat -tlnp 2>/dev/null | grep 5000 || ss -tlnp 2>/dev/null | grep 5000 || echo "❌ Port 5000 not listening"
echo ""

# 6. Check nginx configuration
echo "📋 [6] Checking nginx configuration..."
cat /etc/nginx/sites-enabled/default 2>/dev/null | grep -A 5 "upstream\|proxy_pass" || echo "⚠️  Could not read nginx config"
echo ""

# 7. Check last 50 lines of application logs
echo "📋 [7] Last application logs..."
if [ -f "/app/myhireshield/logs.txt" ]; then
    tail -50 /app/myhireshield/logs.txt
elif [ -f "/root/myhireshield/logs.txt" ]; then
    tail -50 /root/myhireshield/logs.txt
elif command -v pm2 &> /dev/null; then
    pm2 logs --lines 50 --nostream 2>/dev/null || echo "No logs available"
else
    echo "❌ Could not find logs"
fi
echo ""

# 8. Check MongoDB connection
echo "📋 [8] Checking MongoDB connectivity..."
curl -s https://cloud.mongodb.com 2>/dev/null | grep -q "MongoDB" && echo "✅ MongoDB cloud accessible" || echo "⚠️  Could not verify MongoDB"
echo ""

echo "=================================="
echo "✅ Diagnostics Complete"
echo "=================================="
