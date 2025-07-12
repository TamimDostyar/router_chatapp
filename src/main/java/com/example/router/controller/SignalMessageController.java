package com.example.router.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
public class SignalMessageController {
    
    private List<JSONObject> messages = new ArrayList<>();
    
    public String getSignalMessage() {
        JSONObject response = new JSONObject();
        response.put("signal_message", "Signal message from controller");
        response.put("status", "active");
        return response.toString();
    }
    
    @PostMapping("/message")
    @ResponseBody
    public String sendMessage(@RequestBody String messageData) {
        try {
            JSONObject inputMessage = new JSONObject(messageData);
            
            // Create message object with timestamp
            JSONObject message = new JSONObject();
            message.put("device_name", inputMessage.optString("device_name", "Unknown Device"));
            message.put("local_ip", inputMessage.optString("local_ip", "Unknown IP"));
            message.put("message_text", inputMessage.optString("message_text", ""));
            message.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            message.put("message_id", System.currentTimeMillis());
            
            // Store the message
            messages.add(message);
            
            // Return success response
            JSONObject response = new JSONObject();
            response.put("status", "success");
            response.put("message", "Message sent successfully");
            response.put("message_id", message.get("message_id"));
            return response.toString();
            
        } catch (Exception e) {
            JSONObject errorResponse = new JSONObject();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Failed to send message: " + e.getMessage());
            return errorResponse.toString();
        }
    }
    
    @GetMapping("/messages")
    @ResponseBody
    public String getMessages() {
        JSONObject response = new JSONObject();
        response.put("status", "success");
        response.put("message_count", messages.size());
        response.put("messages", messages);
        return response.toString();
    }
    
    @GetMapping("/messages/latest")
    @ResponseBody
    public String getLatestMessage() {
        JSONObject response = new JSONObject();
        if (messages.isEmpty()) {
            response.put("status", "no_messages");
            response.put("message", "No messages available");
        } else {
            JSONObject latestMessage = messages.get(messages.size() - 1);
            response.put("status", "success");
            response.put("latest_message", latestMessage);
        }
        return response.toString();
    }
}