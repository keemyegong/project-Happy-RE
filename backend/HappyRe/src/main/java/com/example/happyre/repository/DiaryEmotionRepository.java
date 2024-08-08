package com.example.happyre.repository;

import com.example.happyre.entity.DiaryEmotionEntity;
import com.example.happyre.entity.DiaryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DiaryEmotionRepository extends JpaRepository<DiaryEmotionEntity, Integer> {

    @Query("SELECT dm FROM DiaryEmotionEntity dm INNER JOIN dm.emotionEntity e WHERE dm.diaryEntity = :diaryEntity AND e.emotion = :emotionName")
    List<DiaryEmotionEntity> findByDiaryAndEmotionString(DiaryEntity diaryEntity, String emotionName);
}
