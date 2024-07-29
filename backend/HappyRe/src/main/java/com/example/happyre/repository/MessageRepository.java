package com.example.happyre.repository;

import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.KeywordEntity;
import com.example.happyre.entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<MessageEntity, Integer> {

    @Query("SELECT m FROM MessageEntity m WHERE m.diaryEntity = :diaryEntity")
    List<MessageEntity> findByDiaryEntity(@Param("diaryEntity") DiaryEntity diaryEntity);

}
