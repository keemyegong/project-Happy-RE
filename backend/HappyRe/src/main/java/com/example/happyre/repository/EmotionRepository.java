package com.example.happyre.repository;

import com.example.happyre.entity.EmotionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmotionRepository extends JpaRepository<EmotionEntity, Integer> {
    @Query("SELECT e FROM EmotionEntity e WHERE e.emotion = :emotionName")
    List<EmotionEntity> findByEmotion(@Param("emotionName") String emotionName);
}
