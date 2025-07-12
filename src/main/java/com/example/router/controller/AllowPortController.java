package com.example.router.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.json.JSONObject;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.io.IOException;
import java.io.BufferedReader;
import java.io.InputStreamReader;

@Controller
public class AllowPortController {
    @ResponseBody
    public String getServerIp() {
        try {
            InetAddress localHost = InetAddress.getLocalHost();
            JSONObject response = new JSONObject();
            response.put("local_ip", localHost.getHostAddress());
            
            String os = System.getProperty("os.name");
            String gatewayIp = null;
            
            if (os.contains("Windows")) {
                try {
                    Process process = Runtime.getRuntime().exec("ipconfig");
                    BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
                    String line;
                    while ((line = reader.readLine()) != null) {
                        if (line.contains("Default Gateway") && line.contains(":")) {
                            gatewayIp = line.split(":")[1].trim();
                            break;
                        }
                    }
                    reader.close();
                } catch (IOException e) {
                }
            } else if (os.contains("Linux") || os.contains("Mac")) {
                try {
                    Process process = Runtime.getRuntime().exec("netstat -nr");
                    BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
                    String line;
                    while ((line = reader.readLine()) != null) {
                        if (line.startsWith("default") || line.startsWith("0.0.0.0")) {
                            String[] parts = line.split("\\s+");
                            if (parts.length > 1) {
                                gatewayIp = parts[1];
                                break;
                            }
                        }
                    }
                    reader.close();
                } catch (IOException e) {
                }
            }
            
            if (gatewayIp != null && !gatewayIp.isEmpty()) {
                response.put("network_gateway", gatewayIp);
            }
            
            return response.toString();
        } catch (UnknownHostException e) {
            JSONObject errorResponse = new JSONObject();
            errorResponse.put("error", e.getMessage());
            return errorResponse.toString();
        }
    }
    
}