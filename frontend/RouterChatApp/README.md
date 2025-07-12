# Router Chat App

A beautiful React Native mobile app that connects to your router message backend to send and receive messages across devices on your network.

## Features

- 📱 Modern, beautiful mobile UI
- 🔌 Connects to your Java Spring Boot backend
- 📡 Displays device IP and network information
- 💬 Send and receive messages across devices
- 🕐 Real-time message timestamps
- 📋 Device information display

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Your backend server running on port 8080

### Installation

1. Navigate to the app directory:
```bash
cd frontend/RouterChatApp
```

2. Install dependencies:
```bash
npm install
```

3. Update the backend URL in `App.tsx`:
```typescript
const BACKEND_URL = 'http://YOUR_BACKEND_IP:8080';
```

### Running the App

1. Start the Expo development server:
```bash
npm start
```

2. Use the Expo Go app on your phone to scan the QR code, or run on simulator:
```bash
npm run ios    # for iOS simulator
npm run android # for Android emulator
npm run web    # for web browser
```

### Backend Setup

Make sure your backend server is running:

1. Navigate to the backend directory:
```bash
cd backend
```

2. Run the Spring Boot application:
```bash
./mvnw spring-boot:run
```

Or use the provided script:
```bash
./app.sh
```

## API Endpoints Used

- `GET /` - Get device information and IP address
- `GET /messages` - Get all messages
- `POST /message` - Send a new message
- `GET /messages/latest` - Get the latest message

## Project Structure

```
frontend/RouterChatApp/
├── App.tsx              # Main app component
├── package.json         # Dependencies
├── README.md           # This file
└── assets/             # Images and icons
```

## Configuration

### Network Configuration

- The app connects to your backend server on port 8080
- Update the `BACKEND_URL` constant in `App.tsx` with your server's IP address
- For testing on device, use your computer's IP address instead of `localhost`

### Finding Your IP Address

On macOS/Linux:
```bash
ifconfig | grep inet
```

On Windows:
```bash
ipconfig
```

## Usage

1. Launch the app on your mobile device
2. The app will automatically fetch your device information
3. View all messages in the chat interface
4. Send messages using the input field at the bottom
5. Messages will include device name, IP address, and timestamp

## Troubleshooting

### Common Issues

1. **Cannot connect to backend**: 
   - Ensure backend server is running
   - Check if the IP address in `BACKEND_URL` is correct
   - Make sure your device is on the same network

2. **TypeScript errors**:
   - Try running `npm install` again
   - Clear cache: `expo start --clear`

3. **Network issues**:
   - Check firewall settings
   - Ensure port 8080 is not blocked

## Contributing

Feel free to submit issues and enhancement requests! 