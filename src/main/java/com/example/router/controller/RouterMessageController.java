package com.example.router.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RouterMessageController {
    
    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("message", "Hello World from Spring Boot MVC!");
        return "hello";
    }
    
    @GetMapping("/api/hello")
    public String apiHello(Model model) {
        model.addAttribute("message", "Hello World from API endpoint!");
        return "hello";
    }
} 