package com.alexandru.timemanagement.repository;

import com.alexandru.timemanagement.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Date;
import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Integer> {
    List<Note> findAllByUserIdOrderByDateDescIdAsc(Integer userId);
    List<Note> findAllByUserIdAndDateGreaterThanEqualOrderByDateDescIdAsc(Integer userId, Date from);
    List<Note> findAllByUserIdAndDateLessThanEqualOrderByDateDescIdAsc(Integer userId, Date to);
    List<Note> findAllByUserIdAndDateBetweenOrderByDateDescIdAsc(Integer userId, Date from, Date to);
}
