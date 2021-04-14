package com.alexandru.timemanagement.service;

import com.alexandru.timemanagement.dto.AuthInput;
import com.alexandru.timemanagement.dto.AuthOutput;
import com.alexandru.timemanagement.dto.Output;
import com.alexandru.timemanagement.dto.RegisterInput;
import com.alexandru.timemanagement.model.User;
import com.alexandru.timemanagement.repository.UserRepository;
import com.alexandru.timemanagement.security.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtTokenUtil;
    private final DBUserDetailsService userDetailsService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public Output userRegister(RegisterInput registerInput) {
        Output result = new Output();

        Optional<User> optionalUser = userRepository.findByUsername(registerInput.getUsername());
        if (optionalUser.isPresent()) {
            result.setStatusEnum(Output.StatusEnum.ERROR);
            result.addMessage(Output.StatusEnum.ERROR, "Username already exists!");
            return result;
        }

        User newUser = new User(
                0,
                registerInput.getUsername(),
                bCryptPasswordEncoder.encode(registerInput.getPassword()),
                User.RoleEnum.USER,
                null);

        newUser = userRepository.save(newUser);
        if (newUser.getId() == 0) {
            result.setStatusEnum(Output.StatusEnum.ERROR);
            result.addMessage(Output.StatusEnum.ERROR, "An error occurred while registering the user!");
        }

        return result;
    }

    public AuthOutput userAuthenticate(AuthInput authInput) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authInput.getUsername(), authInput.getPassword())
            );
        }
        catch (BadCredentialsException e) {
            AuthOutput result = new AuthOutput();
            result.setStatusEnum(Output.StatusEnum.ERROR);
            result.addMessage(Output.StatusEnum.ERROR, "Incorrect username or password!");

            return result;
        }


        final UserDetails userDetails = userDetailsService
                .loadUserByUsername(authInput.getUsername());

        final String jwt = jwtTokenUtil.generateToken(userDetails);

        return new AuthOutput(jwt);
    }
}
