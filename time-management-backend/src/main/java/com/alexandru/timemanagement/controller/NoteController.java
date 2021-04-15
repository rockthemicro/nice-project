package com.alexandru.timemanagement.controller;

import com.alexandru.timemanagement.dto.NoteDto;
import com.alexandru.timemanagement.dto.Output;
import com.alexandru.timemanagement.service.NoteService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/note")
public class NoteController {
    private final NoteService noteService;

    @RequestMapping(
            value = "/createOrUpdate",
            method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<Output> noteCreateOrUpdate(@RequestBody NoteDto noteDto) {
        Output output = noteService.noteCreateOrUpdate(noteDto);

        return ResponseEntity
                .ok()
                .body(output);
    }

    @RequestMapping(
            value = "/createOrUpdateForUser",
            method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<Output> noteCreateOrUpdateForUser(@RequestParam Integer userId,
                                                            @RequestBody NoteDto noteDto) {
        Output output = noteService.noteCreateOrUpdateForUser(userId, noteDto);

        return ResponseEntity
                .ok()
                .body(output);
    }
}