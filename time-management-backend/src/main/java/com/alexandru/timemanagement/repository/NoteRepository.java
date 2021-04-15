package com.alexandru.timemanagement.repository;

import com.alexandru.timemanagement.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository extends JpaRepository<Note, Integer> {
}
