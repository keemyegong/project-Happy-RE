package com.example.happyre.service;

import com.example.happyre.dto.diaryemotion.DiaryEmotionEntityDTO;
import com.example.happyre.entity.DiaryEmotionEntity;

import java.util.Optional;

public interface DiaryEmotionService {
    DiaryEmotionEntity insert(DiaryEmotionEntity diaryEmotionEntity);

    DiaryEmotionEntity insertDTO(DiaryEmotionEntityDTO diaryEmotionEntityDTO);

    Optional<DiaryEmotionEntity> findById(Integer id);
}
