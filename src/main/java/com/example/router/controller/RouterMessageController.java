package com.example.router.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.json.JSONObject;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.io.IOException;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;
import java.util.ArrayList;
import com.example.router.controller.AllowPortController;
import com.example.router.controller.SignalMessageController;

@Controller
public class RouterMessageController {
    JSONObject jsonObject = new JSONObject();
    AllowPortController allowPortController = new AllowPortController();
    SignalMessageController signalMessageController = new SignalMessageController();

    @GetMapping("/")
    @ResponseBody
    public String root() {
        List<String> port_device_info = new ArrayList<>();
        port_device_info.add(allowPortController.getServerIp());
        port_device_info.add(allowPortController.deviceInfo());
        return port_device_info.toString();
    }
    
    @GetMapping("/api/server/home")
    @ResponseBody
    public String home() {
        jsonObject.put("message", "Hello World from Spring Boot MVC!");
        return jsonObject.toString();
    }

    @GetMapping("/api/server/hello")
    @ResponseBody
    public String getJsonMessage() {
        JSONObject response = new JSONObject();
        response.put("message", "Hello World from JSON API!");
        response.put("timestamp", System.currentTimeMillis());
        response.put("status", "success");
        return response.toString();
    }
    
    @GetMapping("/api/server/hello-info")
    @ResponseBody
    public String getJsonHello() {
        JSONObject response = new JSONObject();
        response.put("message", "Hello World from JSON Hello endpoint!");
        response.put("service", "router-message-service");
        response.put("version", "1.0.0");
        return response.toString();
    }
} 