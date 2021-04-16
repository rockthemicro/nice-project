package com.alexandru.timemanagement.service;

import com.alexandru.timemanagement.dto.UserDto;
import com.alexandru.timemanagement.dto.input.AuthInput;
import com.alexandru.timemanagement.dto.input.RegisterInput;
import com.alexandru.timemanagement.dto.output.AuthOutput;
import com.alexandru.timemanagement.dto.output.GetUserOutput;
import com.alexandru.timemanagement.dto.output.Output;
import com.alexandru.timemanagement.model.User;
import com.alexandru.timemanagement.model.mapper.UserMapper;
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

import static com.alexandru.timemanagement.utils.Commons.getCurUserRole;


@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtTokenUtil;
    private final DBUserDetailsService userDetailsService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public Output registerUser(RegisterInput registerInput) {
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

    public AuthOutput authenticateUser(AuthInput authInput) {
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

    public Output createOrUpdateUser(UserDto userDto) {
        Output output = new Output();
        User.RoleEnum curUserRole = getCurUserRole();
        User user;
        String formerPassword = null;

        if (userDto.getId() != null && userDto.getId() != 0) {
            user = userRepository.findById(userDto.getId())
                    .orElseThrow();

            /*
             * if the current user is a manager AND
             * (the manager attempts to change an admin's profile OR
             * the manager attempts to elevate another user up to admin),
             * then the manager does not have sufficient permissions to perform
             * these changes
             */
            if (curUserRole.equals(User.RoleEnum.MANAGER) &&
                    (user.getRole().equals(User.RoleEnum.ADMIN) ||
                     userDto.getRole().equals(User.RoleEnum.ADMIN))) {

                output.setStatusEnum(Output.StatusEnum.ERROR);
                output.addMessage(Output.StatusEnum.ERROR, "You don't have sufficient permissions");
                return output;
            }

            formerPassword = user.getPassword();
        }

        user = UserMapper.INSTANCE.userDtoToUser(userDto);
        if (userDto.getPassword() != null) {
            user.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
        } else {
            user.setPassword(formerPassword);
        }
        userRepository.saveAndFlush(user);

        return output;
    }

    public Output deleteUser(Integer userId) {
        Output output = new Output();
        User user = userRepository.findById(userId)
                .orElseThrow();
        User.RoleEnum curUserRole = getCurUserRole();

        if (curUserRole.equals(User.RoleEnum.MANAGER) &&
                user.getRole().equals(User.RoleEnum.ADMIN)) {

            output.setStatusEnum(Output.StatusEnum.ERROR);
            output.addMessage(Output.StatusEnum.ERROR, "You don't have sufficient permissions");
            return output;
        }

        userRepository.deleteById(userId);

        return output;
    }

    public GetUserOutput getUser(String username) {
        GetUserOutput output = new GetUserOutput();

        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            output.setStatusEnum(Output.StatusEnum.ERROR);
            output.addMessage(Output.StatusEnum.ERROR, "Username not found.");
            return output;
        }

        UserDto userDto = UserMapper.INSTANCE.userToUserDto(userOpt.get());
        userDto.setPassword(null);
        output.setUser(userDto);

        return output;
    }
}
