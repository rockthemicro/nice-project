package com.alexandru.timemanagement.controller;

import com.alexandru.timemanagement.dto.UserDto;
import com.alexandru.timemanagement.dto.input.AuthInput;
import com.alexandru.timemanagement.dto.output.AuthOutput;
import com.alexandru.timemanagement.dto.output.GetUserOutput;
import com.alexandru.timemanagement.dto.output.Output;
import com.alexandru.timemanagement.dto.input.RegisterInput;
import com.alexandru.timemanagement.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    @PostMapping(value = "/auth")
    public ResponseEntity<AuthOutput> authenticateUser(@RequestBody AuthInput authInput) {
        AuthOutput userAuthenticationOutput = userService.authenticateUser(authInput);

        return ResponseEntity
                .ok()
                .body(userAuthenticationOutput);
    }

    @PostMapping(value = "/register")
    public ResponseEntity<Output> registerUser(@RequestBody RegisterInput registerInput) {
        Output output = userService.registerUser(registerInput);

        return ResponseEntity
                .ok()
                .body(output);
    }

    @RequestMapping(value = "/manage/createOrUpdate",
                    method = {RequestMethod.POST,
                              RequestMethod.PUT})
    public ResponseEntity<Output> createOrUpdateUser(@RequestBody UserDto userDto) {
        Output output = userService.createOrUpdateUser(userDto);

        return ResponseEntity
                .ok()
                .body(output);
    }

    @RequestMapping(value = "/manage/deleteUser",
                    method = RequestMethod.DELETE)
    public ResponseEntity<Output> deleteUser(@RequestParam Integer userId) {
        return null;
    }

    @RequestMapping(value = "/manage/getUser",
                    method = RequestMethod.GET)
    public ResponseEntity<GetUserOutput> getUser(@RequestParam String username) {
        GetUserOutput output = userService.getUser(username);

        return ResponseEntity
                .ok()
                .body(output);
    }
}
