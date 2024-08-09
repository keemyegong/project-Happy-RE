package com.example.happyre.service;

import com.example.happyre.entity.EmotionEntity;

import java.util.List;
import java.util.Optional;

public interface EmotionService {
    EmotionEntity insertEmotion(String emotion);

    Optional<EmotionEntity> findById(Integer id);

    List<EmotionEntity> findByEmotion(String s);

    void delete(EmotionEntity emotionEntity);

    void deleteEmotion(String emotion);
}
