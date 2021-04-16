package com.alexandru.timemanagement.service;

import com.alexandru.timemanagement.dto.UserDto;
import com.alexandru.timemanagement.dto.input.AuthInput;
import com.alexandru.timemanagement.dto.input.RegisterInput;
import com.alexandru.timemanagement.dto.output.AuthOutput;
import com.alexandru.timemanagement.dto.output.GetUserOutput;
import com.alexandru.timemanagement.dto.output.Output;
import com.alexandru.timemanagement.dto.output.RegisterOutput;
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
import org.springframework.util.ObjectUtils;

import java.util.Optional;

import static com.alexandru.timemanagement.utils.Commons.getCurUserDetails;
import static com.alexandru.timemanagement.utils.Commons.getCurUserRole;


@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtTokenUtil;
    private final DBUserDetailsService userDetailsService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    private final static String USERNAME_EXISTS = "Username already exists!";
    private final static String USERNAME_NOT_FOUND = "Username not found!";
    private final static String REGISTERING_ERROR = "An error occurred while registering the user!";
    private final static String INCORRECT_CREDS = "Incorrect username or password!";
    private final static String INSUFFICIENT_PERMISSIONS = "You don't have sufficient permissions!";
    private final static String ERROR = "Error!";

    public RegisterOutput registerUser(RegisterInput registerInput) {
        RegisterOutput result = new RegisterOutput();

        Optional<User> optionalUser = userRepository.findByUsername(registerInput.getUsername());
        if (optionalUser.isPresent()) {
            result.setStatusEnum(Output.StatusEnum.ERROR);
            result.addMessage(Output.StatusEnum.ERROR, USERNAME_EXISTS);
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
            result.addMessage(Output.StatusEnum.ERROR, REGISTERING_ERROR);
        } else {
            UserDto userDto = UserMapper.INSTANCE.userToUserDto(newUser);
            userDto.setPassword(null);

            result.setUser(userDto);
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
            result.addMessage(Output.StatusEnum.ERROR, INCORRECT_CREDS);

            return result;
        }


        final UserDetails userDetails = userDetailsService
                .loadUserByUsername(authInput.getUsername());

        final String jwt = jwtTokenUtil.generateToken(userDetails);

        User user = userRepository.findByUsername(authInput.getUsername()).orElseThrow();
        UserDto userDto = UserMapper.INSTANCE.userToUserDto(user);
        userDto.setPassword(null);

        return new AuthOutput(jwt, userDto);
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
             * the manager attempts to change an admin's profile
             * then the manager does not have sufficient permissions to perform
             * these changes
             */
            if (curUserRole.equals(User.RoleEnum.MANAGER) &&
                    user.getRole().equals(User.RoleEnum.ADMIN)) {

                output.setStatusEnum(Output.StatusEnum.ERROR);
                output.addMessage(Output.StatusEnum.ERROR, INSUFFICIENT_PERMISSIONS);
                return output;
            }

            formerPassword = user.getPassword();

        }

        /*
         * if the current user is a manager AND
         * the manager attempts to create/update an admin's profile
         * then the manager does not have sufficient permissions to perform
         * these changes
         */
        if (curUserRole.equals(User.RoleEnum.MANAGER) &&
                userDto.getRole().equals(User.RoleEnum.ADMIN)) {

            output.setStatusEnum(Output.StatusEnum.ERROR);
            output.addMessage(Output.StatusEnum.ERROR, INSUFFICIENT_PERMISSIONS);
            return output;
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

    public Output selfUpdate(UserDto userDto) {
        Output output = new Output();

        UserDetails userDetails = getCurUserDetails();
        if (!userDetails.getUsername().equals(userDto.getUsername())) {
            output.setStatusEnum(Output.StatusEnum.ERROR);
            output.addMessage(Output.StatusEnum.ERROR, ERROR);
            return output;
        }

        User.RoleEnum role = getCurUserRole();
        if (firstRoleIsLowerThanSecond(role, userDto.getRole())) {
            output.setStatusEnum(Output.StatusEnum.ERROR);
            output.addMessage(Output.StatusEnum.ERROR, ERROR);
            return output;
        }

        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        String formerPassword = user.getPassword();

        user = UserMapper.INSTANCE.userDtoToUser(userDto);
        if (ObjectUtils.isEmpty(user.getPassword())) {
            user.setPassword(formerPassword);
        }

        userRepository.saveAndFlush(user);

        return output;
    }

    private boolean firstRoleIsLowerThanSecond(User.RoleEnum first, User.RoleEnum second) {
        if (first.equals(User.RoleEnum.USER) &&
                (second.equals(User.RoleEnum.MANAGER) ||
                 second.equals(User.RoleEnum.ADMIN))) {
            return true;
        }

        if (first.equals(User.RoleEnum.MANAGER) &&
                second.equals(User.RoleEnum.ADMIN)) {
            return true;
        }

        return false;
    }

    public Output deleteUser(Integer userId) {
        Output output = new Output();
        User user = userRepository.findById(userId)
                .orElseThrow();
        User.RoleEnum curUserRole = getCurUserRole();

        if (curUserRole.equals(User.RoleEnum.MANAGER) &&
                user.getRole().equals(User.RoleEnum.ADMIN)) {

            output.setStatusEnum(Output.StatusEnum.ERROR);
            output.addMessage(Output.StatusEnum.ERROR, INSUFFICIENT_PERMISSIONS);
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
            output.addMessage(Output.StatusEnum.ERROR, USERNAME_NOT_FOUND);
            return output;
        }

        UserDto userDto = UserMapper.INSTANCE.userToUserDto(userOpt.get());
        userDto.setPassword(null);
        output.setUser(userDto);

        return output;
    }

}
