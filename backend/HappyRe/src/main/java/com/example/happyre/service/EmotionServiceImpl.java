package com.example.happyre.service;

import com.example.happyre.entity.EmotionEntity;
import com.example.happyre.repository.EmotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class EmotionServiceImpl implements EmotionService {

    private final EmotionRepository emotionRepository;

    @Override
    public Optional<EmotionEntity> findById(Integer id) {
        return Optional.empty();
    }
}
