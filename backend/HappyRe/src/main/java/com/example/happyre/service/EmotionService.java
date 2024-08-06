package com.example.happyre.service;

import com.example.happyre.entity.EmotionEntity;

import java.util.Optional;

public interface EmotionService {
    Optional<EmotionEntity> findById(Integer id);
}
