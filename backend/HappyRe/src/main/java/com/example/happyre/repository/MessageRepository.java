package com.example.happyre.repository;

import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.MessageEntity;
import com.example.happyre.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<MessageEntity, Integer> {

    @Query("SELECT m FROM MessageEntity m WHERE m.diaryEntity = :diaryEntity")
    List<MessageEntity> findByDiaryEntity(@Param("diaryEntity") DiaryEntity diaryEntity);

    @Query("SELECT m FROM MessageEntity m INNER JOIN m.diaryEntity d WHERE d.userEntity = :userEntity AND m.archived = :isArchived")
    List<MessageEntity> findByArchivedAndUserEntity(@Param("isArchived") Boolean isArchived, @Param("userEntity") UserEntity userEntity);
}
