package com.alexandru.timemanagement.controller;

import com.alexandru.timemanagement.dto.AuthInput;
import com.alexandru.timemanagement.dto.AuthOutput;
import com.alexandru.timemanagement.dto.Output;
import com.alexandru.timemanagement.dto.RegisterInput;
import com.alexandru.timemanagement.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    @PostMapping(value = "/auth")
    public ResponseEntity<AuthOutput> userAuthenticate(@RequestBody AuthInput authInput) {
        AuthOutput userAuthenticationOutput = userService.userAuthenticate(authInput);

        return ResponseEntity
                .ok()
                .body(userAuthenticationOutput);
    }

    @PostMapping(value = "/register")
    public ResponseEntity<Output> userRegister(@RequestBody RegisterInput registerInput) {
        Output output = userService.userRegister(registerInput);

        return ResponseEntity
                .ok()
                .body(output);
    }
}
