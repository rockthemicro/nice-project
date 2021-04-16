package com.alexandru.timemanagement.dto.input;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeleteNotesInput {
    private Integer[] noteIds;
}
