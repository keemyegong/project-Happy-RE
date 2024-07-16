package com.ssafy.db.repository;

import com.ssafy.db.entity.DiaryEmotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiaryEmotionRepository extends JpaRepository<DiaryEmotion, Integer> {
}
