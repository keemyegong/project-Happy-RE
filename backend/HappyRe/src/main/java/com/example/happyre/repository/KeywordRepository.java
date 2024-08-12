package com.example.happyre.repository;

import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.EmotionEntity;
import com.example.happyre.entity.KeywordEntity;
import com.example.happyre.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface KeywordRepository extends JpaRepository<KeywordEntity, Integer> {

    @Query("SELECT k FROM KeywordEntity k WHERE k.diaryEntity = :diaryEntity")
    List<KeywordEntity> findByDiaryEntity(@Param("diaryEntity") DiaryEntity diaryEntity);

    @Query("SELECT k FROM KeywordEntity k INNER JOIN k.diaryEntity d WHERE d.userEntity = :userEntity AND k.keyword = :keyword")
    List<KeywordEntity> findByKeywordAndUserEntity(@Param("keyword") String keyword, @Param("userEntity") UserEntity userEntity);

    @Query("SELECT k FROM KeywordEntity k INNER JOIN k.diaryEntity d WHERE d.userEntity = :userEntity AND k.archived = :isArchived")
    List<KeywordEntity> findByArchivedAndUserEntity(@Param("isArchived") Boolean isArchived, @Param("userEntity") UserEntity userEntity);

    @Query("SELECT k FROM KeywordEntity k WHERE k.diaryEntity IN :diaryEntities")
    List<KeywordEntity> findByDiaryEntities(@Param("diaryEntities") List<DiaryEntity> diaryEntities);



}
