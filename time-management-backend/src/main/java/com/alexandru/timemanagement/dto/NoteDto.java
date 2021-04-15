package com.alexandru.timemanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NoteDto {
    private Integer id;
    private String content;
    private Float hours;
    private Date date;
}
