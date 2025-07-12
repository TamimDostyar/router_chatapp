# Router Chat Through Router

A complete chat application that allows devices on the same network to communicate with each other through a Spring Boot backend and React Native mobile frontend.

## 🏗️ Architecture

- **Backend**: Java Spring Boot REST API (Port 8080)
- **Frontend**: React Native mobile app built with Expo
- **Communication**: RESTful API endpoints for device info and messaging

## 📁 Project Structure

```
chat_through_router/
├── backend/                    # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/example/router/
│   │       │       ├── controller/
│   │       │       │   ├── AllowPortController.java
│   │       │       │   ├── RouterMessageController.java
│   │       │       │   └── SignalMessageController.java
│   │       │       └── RouterMessageApplication.java
│   │       └── resources/
│   │           └── application.properties
│   ├── pom.xml
│   └── app.sh
└── frontend/                   # React Native frontend
    └── RouterChatApp/
        ├── App.tsx
        ├── package.json
        └── README.md
```

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Run the Spring Boot application
./app.sh
# OR
./mvnw spring-boot:run
```

The backend server will start on `http://localhost:8080`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend/RouterChatApp

# Install dependencies
npm install

# Start the Expo development server
npm start
```

## 🔧 Configuration

### Backend Configuration

The backend runs on port 8080 and provides the following endpoints:

- `GET /` - Device information and IP address
- `GET /messages` - All messages
- `POST /message` - Send a new message
- `GET /messages/latest` - Latest message
- `GET /api/server/hello` - Test endpoint

### Frontend Configuration

Update the backend URL in `frontend/RouterChatApp/App.tsx`:

```typescript
const BACKEND_URL = 'http://YOUR_COMPUTER_IP:8080';
```

**Finding Your IP Address:**
- macOS/Linux: `ifconfig | grep inet`
- Windows: `ipconfig`

## 📱 Features

### Backend Features
- ✅ Device IP detection (local and gateway)
- ✅ Cross-platform OS detection
- ✅ Message storage and retrieval
- ✅ RESTful API endpoints
- ✅ JSON response format

### Frontend Features
- ✅ Beautiful, modern mobile UI
- ✅ Real-time device information display
- ✅ Message sending and receiving
- ✅ Chat history with timestamps
- ✅ Device name and IP tracking
- ✅ Responsive design
- ✅ Error handling and loading states

## 🛠️ Development

### Backend Development

```bash
cd backend

# Run in development mode
./mvnw spring-boot:run

# Build for production
./mvnw clean package
```

### Frontend Development

```bash
cd frontend/RouterChatApp

# Start development server
npm start

# Run on specific platforms
npm run ios       # iOS simulator
npm run android   # Android emulator
npm run web      # Web browser
```

## 🔌 API Documentation

### Get Device Information
```
GET /
Response: ["{"local_ip":"192.168.1.100","network_gateway":"192.168.1.1"}", "{"device_info":"Device info: Mac OS X"}"]
```

### Send Message
```
POST /message
Content-Type: application/json

{
  "device_name": "MacBook Pro",
  "local_ip": "192.168.1.100",
  "message_text": "Hello from my device!"
}
```

### Get All Messages
```
GET /messages
Response: {
  "status": "success",
  "message_count": 5,
  "messages": [...]
}
```

## 🚦 Testing

### Backend Testing

```bash
# Test device info endpoint
curl http://localhost:8080/

# Test message sending
curl -X POST http://localhost:8080/message \
  -H "Content-Type: application/json" \
  -d '{"device_name":"Test Device","local_ip":"192.168.1.100","message_text":"Test message"}'

# Test message retrieval
curl http://localhost:8080/messages
```

### Frontend Testing

1. Start the backend server
2. Update the `BACKEND_URL` in App.tsx
3. Run the mobile app
4. Send test messages

## 🐛 Troubleshooting

### Common Issues

1. **Connection refused**: Backend server not running
2. **Network unreachable**: Wrong IP address in frontend config
3. **CORS issues**: Add your mobile IP to backend CORS configuration if needed
4. **Port conflicts**: Ensure port 8080 is available

### Network Configuration

- Both devices must be on the same network
- Firewall may block connections (check port 8080)
- Some routers block inter-device communication

## 🔮 Future Enhancements

- [ ] Real-time messaging with WebSocket
- [ ] Message encryption
- [ ] User authentication
- [ ] File sharing
- [ ] Group chat rooms
- [ ] Message search and filtering
- [ ] Push notifications
- [ ] Message persistence with database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License. 