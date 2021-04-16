package com.alexandru.timemanagement.service;

import com.alexandru.timemanagement.dto.input.DeleteNotesInput;
import com.alexandru.timemanagement.dto.output.GetNotesOutput;
import com.alexandru.timemanagement.dto.NoteDto;
import com.alexandru.timemanagement.dto.output.Output;
import com.alexandru.timemanagement.model.Note;
import com.alexandru.timemanagement.model.User;
import com.alexandru.timemanagement.model.mapper.NoteMapper;
import com.alexandru.timemanagement.repository.NoteRepository;
import com.alexandru.timemanagement.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import static com.alexandru.timemanagement.utils.Commons.checkUserDetailsRole;
import static com.alexandru.timemanagement.utils.Commons.getUserDetails;

@Service
@AllArgsConstructor
public class NoteService {

    private final UserRepository userRepository;
    private final NoteRepository noteRepository;

    private static final String YOU_HAVE_NO_NOTES = "You are a privileged user and"
            + " you possess no Notes of your own.";
    private static final String YOU_CANT_CHANGE_NOTES = "You cannot change Notes for"
            + " privileged users.";

    public Output createOrUpdateNote(NoteDto noteDto) {
        Output output;

        UserDetails userDetails = getUserDetails();

        if (!checkUserDetailsRole(userDetails, User.RoleEnum.USER)) {
            output = new Output();
            output.setStatusEnum(Output.StatusEnum.ERROR);
            output.addMessage(Output.StatusEnum.ERROR, YOU_HAVE_NO_NOTES);
        } else {
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow();
            output = saveNoteForUser(noteDto, user);
        }

        return output;
    }

    public Output createOrUpdateNoteForUser(Integer userId, NoteDto noteDto) {
        Output output;
        User user = userRepository.findById(userId)
                .orElseThrow();

        if (!user.getRole().equals(User.RoleEnum.USER)) {
            output = new Output();
            output.setStatusEnum(Output.StatusEnum.ERROR);
            output.addMessage(Output.StatusEnum.ERROR, YOU_CANT_CHANGE_NOTES);
        } else {
            output = saveNoteForUser(noteDto, user);
        }

        return output;
    }

    public GetNotesOutput getNotes(Date from, Date to) {
        GetNotesOutput output = new GetNotesOutput();

        UserDetails userDetails = getUserDetails();
        if (!checkUserDetailsRole(userDetails, User.RoleEnum.USER)) {
            output.setStatusEnum(Output.StatusEnum.ERROR);
            output.addMessage(Output.StatusEnum.ERROR, YOU_HAVE_NO_NOTES);
        } else {
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow();

            NoteDto[] notes = retrieveNotes(user.getId(), from, to);
            output.setNotes(notes);
        }

        return output;
    }

    public GetNotesOutput getNotesForUser(Integer userId, Date from, Date to) {
        GetNotesOutput output = new GetNotesOutput();

        User user = userRepository.findById(userId)
                .orElseThrow();

        if (!user.getRole().equals(User.RoleEnum.USER)) {
            output.setStatusEnum(Output.StatusEnum.ERROR);
            output.addMessage(Output.StatusEnum.ERROR, YOU_CANT_CHANGE_NOTES);
        } else {
            NoteDto[] notes = retrieveNotes(userId, from, to);
            output.setNotes(notes);
        }

        return output;
    }


    public Output deleteNotes(DeleteNotesInput input) {
        Output output = new Output();

        UserDetails userDetails = getUserDetails();
        if (!checkUserDetailsRole(userDetails, User.RoleEnum.USER)) {
            output.setStatusEnum(Output.StatusEnum.ERROR);
            output.addMessage(Output.StatusEnum.ERROR, YOU_HAVE_NO_NOTES);
        } else {
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow();

            noteRepository.deleteAllByIdsAndUserId(input.getNoteIds(), user.getId());
        }

        return output;
    }

    public Output deleteNotesForUser(Integer userId, DeleteNotesInput input) {
        Output output = new Output();

        User user = userRepository.findById(userId)
                .orElseThrow();

        if (!user.getRole().equals(User.RoleEnum.USER)) {
            output.setStatusEnum(Output.StatusEnum.ERROR);
            output.addMessage(Output.StatusEnum.ERROR, YOU_CANT_CHANGE_NOTES);
        } else {
            noteRepository.deleteAllByIdsAndUserId(input.getNoteIds(), userId);
        }

        return output;
    }

    private NoteDto[] retrieveNotes(Integer userId, Date from, Date to) {
        List<Note> notes;

        if (from != null && to != null) {
            notes = noteRepository.findAllByUserIdAndDateBetweenOrderByDateDescIdAsc(userId, from, to);
        } else if (from != null) {
            notes = noteRepository.findAllByUserIdAndDateGreaterThanEqualOrderByDateDescIdAsc(userId, from);
        } else if (to != null) {
            notes = noteRepository.findAllByUserIdAndDateLessThanEqualOrderByDateDescIdAsc(userId, to);
        } else {
            notes = noteRepository.findAllByUserIdOrderByDateDescIdAsc(userId);
        }

        return notes.stream()
                .map(NoteMapper.INSTANCE::noteToNoteDto)
                .toArray(NoteDto[]::new);
    }

    private Output saveNoteForUser(NoteDto noteDto, User user) {
        Output output = new Output();

        if (noteDto.getId() != null && noteDto.getId() != 0) {
            Optional<Note> noteOpt = noteRepository.findById(noteDto.getId());

            if (noteOpt.isEmpty()) {
                output.setStatusEnum(Output.StatusEnum.ERROR);
                output.addMessage(Output.StatusEnum.ERROR, "Error updating this note.");
                return output;
            }
        }

        Note note = NoteMapper.INSTANCE.noteDtoToNote(noteDto);
        note.setUser(user);
        noteRepository.saveAndFlush(note);

        return output;
    }

}
