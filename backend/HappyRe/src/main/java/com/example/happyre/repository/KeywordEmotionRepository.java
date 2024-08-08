package com.example.happyre.repository;

import com.example.happyre.entity.KeywordEmotionEntity;
import com.example.happyre.entity.KeywordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface KeywordEmotionRepository extends JpaRepository<KeywordEmotionEntity, Integer> {
    @Query("SELECT km FROM KeywordEmotionEntity km INNER JOIN km.emotionEntity e WHERE km.keywordEntity = :keywordEntity AND e.emotion = :emotionName")
    List<KeywordEmotionEntity> findByKeywordAndEmotionString(@Param("keywordEntity") KeywordEntity keywordEntity, @Param("emotionName") String emotionName);
}
