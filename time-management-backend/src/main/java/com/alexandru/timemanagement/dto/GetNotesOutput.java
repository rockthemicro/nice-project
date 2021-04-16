package com.alexandru.timemanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetNotesOutput extends Output {
    private NoteDto[] notes;
}
