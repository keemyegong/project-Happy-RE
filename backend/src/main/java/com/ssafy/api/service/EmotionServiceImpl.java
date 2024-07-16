package com.ssafy.api.service;

import com.ssafy.db.entity.Emotion;
import com.ssafy.db.repository.EmotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmotionServiceImpl implements EmotionService{

    @Autowired
    EmotionRepository emotionRepository;

    @Override
    public Emotion getEmotionById(int emotionId) {
        return emotionRepository.findByEmotionId(emotionId).get();
    }
}
