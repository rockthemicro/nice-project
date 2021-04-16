package com.alexandru.timemanagement.controller;

import com.alexandru.timemanagement.dto.GetNotesOutput;
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

import java.sql.Date;

@RestController
@AllArgsConstructor
@RequestMapping("/api/note")
public class NoteController {
    private final NoteService noteService;

    @RequestMapping(
            value = "/createOrUpdate",
            method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<Output> createOrUpdateNote(@RequestBody NoteDto noteDto) {
        Output output = noteService.createOrUpdateNote(noteDto);
        return ResponseEntity
                .ok()
                .body(output);
    }

    @RequestMapping(
            value = "/createOrUpdateForUser",
            method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<Output> createOrUpdateNoteForUser(@RequestParam Integer userId,
                                                            @RequestBody NoteDto noteDto) {
        Output output = noteService.createOrUpdateNoteForUser(userId, noteDto);
        return ResponseEntity
                .ok()
                .body(output);
    }

    @RequestMapping(
            value = "/getNotes",
            method = RequestMethod.GET)
    public ResponseEntity<GetNotesOutput> getNotes(@RequestParam(required = false) Date from,
                                                   @RequestParam(required = false) Date to) {

        GetNotesOutput output = noteService.getNotes(from, to);
        return ResponseEntity
                .ok()
                .body(output);
    }


    @RequestMapping(
            value = "/getNotesForUser",
            method = RequestMethod.GET)
    public ResponseEntity<GetNotesOutput> getNotesForUser(@RequestParam Integer userId,
                                                          @RequestParam(required = false) Date from,
                                                          @RequestParam(required = false) Date to) {

        GetNotesOutput output = noteService.getNotesForUser(userId, from, to);
        return ResponseEntity
                .ok()
                .body(output);
    }
}