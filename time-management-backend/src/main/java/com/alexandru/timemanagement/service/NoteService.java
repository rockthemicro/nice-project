package com.alexandru.timemanagement.service;

import com.alexandru.timemanagement.dto.NoteDto;
import com.alexandru.timemanagement.dto.Output;
import com.alexandru.timemanagement.model.User;
import com.alexandru.timemanagement.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import static com.alexandru.timemanagement.utils.Commons.checkUserDetailsRole;

@Service
@AllArgsConstructor
public class NoteService {

    private final UserRepository userRepository;

    private Output createOrUpdate(NoteDto noteDto, Integer userId) {
        return new Output();
    }

    public Output noteCreateOrUpdate(NoteDto noteDto) {
        Output output;

        UserDetails userDetails = (UserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        if (!checkUserDetailsRole(userDetails, User.RoleEnum.USER)) {
            output = new Output();
            output.setStatusEnum(Output.StatusEnum.ERROR);
            output.addMessage(Output.StatusEnum.ERROR, "You are a privileged user and"
                    + " you possess no Notes of your own.");
        } else {
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow();
            output = createOrUpdate(noteDto, user.getId());
        }

        return output;
    }

    public Output noteCreateOrUpdateForUser(Integer userId, NoteDto noteDto) {
        Output output;
        User user = userRepository.findById(userId)
                .orElseThrow();

        if (!user.getRole().equals(User.RoleEnum.USER)) {
            output = new Output();
            output.setStatusEnum(Output.StatusEnum.ERROR);
            output.addMessage(Output.StatusEnum.ERROR, "You cannot change Notes for"
                    + " privileged users.");
        } else {
            output = createOrUpdate(noteDto, userId);
        }

        return output;
    }
}
