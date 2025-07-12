mvn clean install
mvn spring-boot:run


# Send a message
curl -X POST http://localhost:8080/message \
  -H "Content-Type: application/json" \
  -d '{"device_name":"My Phone","local_ip":"192.168.1.100","message_text":"Hello!"}'

# Get all messages  
curl http://localhost:8080/messages

# Get latest message
curl http://localhost:8080/messages/latest