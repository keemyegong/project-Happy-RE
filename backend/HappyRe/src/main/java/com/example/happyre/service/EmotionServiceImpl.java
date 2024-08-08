package com.example.happyre.service;

import com.example.happyre.entity.EmotionEntity;
import com.example.happyre.repository.EmotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class EmotionServiceImpl implements EmotionService {

    private final EmotionRepository emotionRepository;

    @Override
    public EmotionEntity insertEmotion(String emotion){
        List<EmotionEntity> emotionEntityList = findByEmotion(emotion);
        if(emotionEntityList.isEmpty()){
            EmotionEntity emotionEntity = new EmotionEntity();
            emotionEntity.setEmotion(emotion.strip());
            return emotionRepository.save(emotionEntity);
        }else{
            return emotionEntityList.get(0);
        }
    }

    @Override
    public Optional<EmotionEntity> findById(Integer id) {
        return emotionRepository.findById(id);
    }

    @Override
    public List<EmotionEntity> findByEmotion(String s){
        return emotionRepository.findByEmotion(s.strip());
    }

    @Override
    public void delete(EmotionEntity emotionEntity){
        emotionRepository.delete(emotionEntity);
    }

    @Override
    public void deleteEmotion(String emotion){
        List<EmotionEntity> emotionEntityList = findByEmotion(emotion);
        if(emotionEntityList.isEmpty()){
            throw new RuntimeException("deleteEmotion: 지정한 emotion:" + emotion.strip() + " 에 해당하는 emotion 객체를 찾을 수 없음.");
        }else{
            delete(emotionEntityList.get(0));
        }
    }
}
