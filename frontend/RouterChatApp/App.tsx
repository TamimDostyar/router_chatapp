import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  RefreshControl,
  Modal,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  message_id: number;
  device_name: string;
  local_ip: string;
  message_text: string;
  timestamp: string;
}

interface DeviceInfo {
  local_ip: string;
  network_gateway?: string;
  device_info?: string;
}

const BACKEND_URL = 'http://192.168.1.172:8080'; // Update this to your backend URL

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  const [tempUserName, setTempUserName] = useState('');
  const [showNameModal, setShowNameModal] = useState(true);

  useEffect(() => {
    if (userName) {
      fetchDeviceInfo();
      fetchMessages();
      
      // Auto-refresh messages every 2 seconds
      const interval = setInterval(() => {
        fetchMessages(true); // Pass true for silent refresh
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [userName]);

  const handleSetUserName = () => {
    if (!tempUserName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    setUserName(tempUserName.trim());
    setShowNameModal(false);
  };

  const fetchDeviceInfo = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/`);
      const data = response.data;
      
      // Parse the JSON response directly
      setDeviceInfo({ 
        local_ip: data.local_ip || 'Unknown IP', 
        device_info: data.device_info || 'Unknown Device' 
      });
    } catch (error) {
      console.error('Error fetching device info:', error);
      Alert.alert('Error', 'Failed to fetch device information');
    }
  };

  const fetchMessages = async (silent: boolean = false) => {
    try {
      if (!silent) {
        setIsRefreshing(true);
      }
      const response = await axios.get(`${BACKEND_URL}/messages`);
      const data = response.data;
      if (data.status === 'success') {
        setMessages(data.messages || []);
      }
    } catch (error) {
      if (!silent) {
        console.error('Error fetching messages:', error);
      }
    } finally {
      if (!silent) {
        setIsRefreshing(false);
      }
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    if (!deviceInfo) {
      Alert.alert('Error', 'Device information not available');
      return;
    }

    setIsLoading(true);
    try {
      const messageData = {
        device_name: userName || 'Unknown User',
        local_ip: deviceInfo.local_ip || 'Unknown IP',
        message_text: newMessage.trim(),
      };

      await axios.post(`${BACKEND_URL}/message`, messageData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setNewMessage('');
      fetchMessages(); // Refresh messages
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const parseDeviceInfo = (deviceInfoString: string): string => {
    try {
      if (deviceInfoString.startsWith('{') && deviceInfoString.endsWith('}')) {
        const parsed = JSON.parse(deviceInfoString);
        return parsed.device_info || parsed.name || 'Unknown Device';
      }
      return deviceInfoString;
    } catch (error) {
      return deviceInfoString;
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={styles.messageItem}>
      <View style={styles.messageHeader}>
        <Text style={styles.deviceName}>{item.device_name}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
      <Text style={styles.messageText}>{item.message_text}</Text>
      <Text style={styles.ipAddress}>From: {item.local_ip}</Text>
      <Text style={styles.deviceLabel}>Device: {parseDeviceInfo(deviceInfo?.device_info || 'Unknown Device')}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      
      {/* Name Input Modal */}
      <Modal
        visible={showNameModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Welcome to Router Chat! 👋</Text>
            <Text style={styles.modalSubtitle}>What's your name?</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your name..."
              value={tempUserName}
              onChangeText={setTempUserName}
              maxLength={30}
              autoFocus={true}
            />
            
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleSetUserName}
            >
              <Text style={styles.modalButtonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="phone-portrait" size={24} color="white" />
          <Text style={styles.headerTitle}>
            Hi, {userName || 'User'}! 👋
          </Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={() => fetchMessages()}
            disabled={isRefreshing}
          >
            <Ionicons 
              name={isRefreshing ? "hourglass" : "refresh"} 
              size={20} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
        {deviceInfo && (
          <View style={styles.deviceInfoContainer}>
            <View style={styles.deviceInfoRow}>
              <Text style={styles.deviceInfoText}>
                IP: {deviceInfo.local_ip}
              </Text>
              <View style={[styles.statusDot, { backgroundColor: deviceInfo ? '#4CAF50' : '#FF5722' }]} />
            </View>
            <Text style={styles.deviceInfoText}>
              {deviceInfo.device_info}
            </Text>
            <Text style={styles.autoRefreshText}>
              🔄 Auto-refresh every 2 seconds
            </Text>
          </View>
        )}
      </View>

      {/* Messages List */}
      <View style={styles.messagesContainer}>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.message_id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesList}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchMessages()}
              colors={['#4A90E2']}
              tintColor="#4A90E2"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>Start a conversation!</Text>
            </View>
          }
        />
      </View>

      {/* Message Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={isLoading}
          >
            <Ionicons
              name={isLoading ? "hourglass" : "send"}
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4A90E2',
    paddingVertical: 20,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
  },
  refreshButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 8,
  },
  deviceInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deviceInfoText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  autoRefreshText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  messagesList: {
    padding: 16,
  },
  messageItem: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  messageText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
    lineHeight: 22,
  },
  ipAddress: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  deviceLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginTop: 2,
  },
  inputContainer: {
    backgroundColor: 'white',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    backgroundColor: '#f8f9fa',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
    fontWeight: '500',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
  },
  modalButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 12,
    minWidth: 150,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
