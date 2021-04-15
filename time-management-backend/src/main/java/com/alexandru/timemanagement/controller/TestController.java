package com.alexandru.timemanagement.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("ping")
    public String ping() {
        return "pong";
    }

    @GetMapping("ping-manager")
    public String pingManager() {
        return "pong-manager";
    }

    @GetMapping("ping-admin")
    public String pingAdmin() {
        return "pong-admin";
    }
}
