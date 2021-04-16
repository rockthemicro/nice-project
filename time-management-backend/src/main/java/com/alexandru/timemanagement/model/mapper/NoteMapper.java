package com.alexandru.timemanagement.model.mapper;

import com.alexandru.timemanagement.dto.NoteDto;
import com.alexandru.timemanagement.model.Note;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface NoteMapper {
    NoteMapper INSTANCE = Mappers.getMapper(NoteMapper.class);

    Note noteDtoToNote(NoteDto noteDto);

    NoteDto noteToNoteDto(Note note);
}
