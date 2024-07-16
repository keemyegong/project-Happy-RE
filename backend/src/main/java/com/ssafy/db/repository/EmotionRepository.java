package com.ssafy.db.repository;

import com.ssafy.db.entity.Emotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmotionRepository extends JpaRepository<Emotion, Integer> {
    Optional<Emotion> findByEmotionId(int emotionId);
}
