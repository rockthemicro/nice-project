package com.alexandru.timemanagement.repository;

import com.alexandru.timemanagement.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.sql.Date;
import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Integer> {
    List<Note> findAllByUserIdOrderByDateDescIdAsc(Integer userId);
    List<Note> findAllByUserIdAndDateGreaterThanEqualOrderByDateDescIdAsc(Integer userId, Date from);
    List<Note> findAllByUserIdAndDateLessThanEqualOrderByDateDescIdAsc(Integer userId, Date to);
    List<Note> findAllByUserIdAndDateBetweenOrderByDateDescIdAsc(Integer userId, Date from, Date to);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM note WHERE user_id = ?2 AND id IN (?1)", nativeQuery = true)
    void deleteAllByIdsAndUserId(Integer[] noteIds, Integer userId);
}
