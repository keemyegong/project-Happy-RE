package com.ssafy.db.repository;

import com.ssafy.db.entity.KeywordEmotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KeywordEmotionRepository extends JpaRepository<KeywordEmotion, Integer> {
}
