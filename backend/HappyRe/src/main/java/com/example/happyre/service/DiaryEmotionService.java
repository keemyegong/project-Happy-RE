package com.example.happyre.service;

import com.example.happyre.dto.diaryemotion.DiaryEmotionDTO;
import com.example.happyre.dto.diaryemotion.DiaryEmotionEntityDTO;
import com.example.happyre.entity.DiaryEmotionEntity;
import com.example.happyre.entity.DiaryEntity;

import java.util.List;
import java.util.Optional;

public interface DiaryEmotionService {
    DiaryEmotionEntity insert(DiaryEmotionEntity diaryEmotionEntity);

    DiaryEmotionEntity insertDTO(DiaryEmotionDTO diaryEmotionDTO);

    Optional<DiaryEmotionEntity> findById(Integer id);

    List<DiaryEmotionEntity> findByDiaryAndEmotionString(DiaryEntity diaryEntity, String emotionName);

    void delete(DiaryEmotionEntity diaryEmotionEntity);
}
