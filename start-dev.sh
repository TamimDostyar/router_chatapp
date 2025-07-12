#!/bin/bash

# Router Chat Development Startup Script

echo "🚀 Starting Router Chat Development Environment"
echo "=============================================="

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists java; then
    echo "❌ Java is not installed. Please install Java 11 or higher."
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 14 or higher."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ All prerequisites found"

# Get local IP address
echo "📡 Detecting local IP address..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    LOCAL_IP=$(ifconfig | grep "inet " | grep -Fv 127.0.0.1 | grep -Fv 192.168 | awk '{print $2}' | head -1)
    if [ -z "$LOCAL_IP" ]; then
        LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
    fi
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    LOCAL_IP=$(hostname -I | awk '{print $1}')
else
    echo "⚠️  Could not auto-detect IP address. Please manually update BACKEND_URL in App.tsx"
    LOCAL_IP="localhost"
fi

echo "🌐 Local IP detected: $LOCAL_IP"

# Update frontend configuration
echo "🔧 Updating frontend configuration..."
if [ -f "frontend/RouterChatApp/App.tsx" ]; then
    sed -i.bak "s|const BACKEND_URL = '[^']*';|const BACKEND_URL = 'http://$LOCAL_IP:8080';|g" frontend/RouterChatApp/App.tsx
    echo "✅ Frontend configuration updated with IP: $LOCAL_IP"
else
    echo "⚠️  Frontend App.tsx not found. Please update BACKEND_URL manually."
fi

# Start backend in background
echo "🔥 Starting backend server..."
cd backend
if [ -f "app.sh" ]; then
    chmod +x app.sh
    ./app.sh &
    BACKEND_PID=$!
    echo "✅ Backend server started (PID: $BACKEND_PID)"
else
    echo "⚠️  app.sh not found, trying maven..."
    if [ -f "pom.xml" ]; then
        ./mvnw spring-boot:run &
        BACKEND_PID=$!
        echo "✅ Backend server started with maven (PID: $BACKEND_PID)"
    else
        echo "❌ Could not start backend server. Please check backend directory."
        exit 1
    fi
fi

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 10

# Test backend
echo "🧪 Testing backend connection..."
if curl -s http://localhost:8080/ > /dev/null; then
    echo "✅ Backend is running successfully"
else
    echo "⚠️  Backend might not be fully started yet. Please check manually."
fi

# Start frontend
echo "📱 Starting frontend..."
cd ../frontend/RouterChatApp

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start expo
echo "🌟 Starting Expo development server..."
npm start &
FRONTEND_PID=$!

echo ""
echo "🎉 Development environment started successfully!"
echo "=============================================="
echo "Backend Server: http://localhost:8080"
echo "Frontend: Check the Expo interface that opened"
echo "Local IP: $LOCAL_IP"
echo ""
echo "📱 To test on your phone:"
echo "1. Install Expo Go app from App Store/Play Store"
echo "2. Scan the QR code from the Expo interface"
echo "3. Make sure your phone is on the same network"
echo ""
echo "🔧 Backend PID: $BACKEND_PID"
echo "🔧 Frontend PID: $FRONTEND_PID"
echo ""
echo "💡 To stop all services:"
echo "kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "📚 Check README.md for more details"

# Keep script running
wait 