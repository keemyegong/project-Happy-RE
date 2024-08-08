package com.example.happyre.service;

import com.example.happyre.dto.diaryemotion.DiaryEmotionEntityDTO;
import com.example.happyre.entity.DiaryEmotionEntity;
import com.example.happyre.repository.DiaryEmotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DiaryEmotionServiceImpl implements DiaryEmotionService {

    private final DiaryEmotionRepository diaryEmotionRepository;
    private final EmotionService emotionService;
    private final DiaryService diaryService;

    @Override
    public DiaryEmotionEntity insert(DiaryEmotionEntity diaryEmotionEntity){
        if (diaryEmotionEntity.getDiaryEntity() == null) throw new AssertionError();
        if (diaryEmotionEntity.getEmotionEntity() == null) throw new AssertionError();
        return diaryEmotionRepository.save(diaryEmotionEntity);
    }

    @Override
    public DiaryEmotionEntity insertDTO(DiaryEmotionEntityDTO diaryEmotionEntityDTO){
        if(diaryEmotionEntityDTO.getEmotionId() == null) throw new AssertionError();
        if(diaryEmotionEntityDTO.getDiaryId() == null) throw new AssertionError();
        DiaryEmotionEntity diaryEmotionEntity = new DiaryEmotionEntity();
        diaryEmotionEntity.setEmotionEntity(emotionService.findById(diaryEmotionEntityDTO.getEmotionId()).orElseThrow(() -> new RuntimeException("Emotion 없음")));
        diaryEmotionEntity.setDiaryEntity(diaryService.findById(diaryEmotionEntityDTO.getDiaryId()).orElseThrow(() -> new RuntimeException("Diary 없음")));
        return insert(diaryEmotionEntity);
    }

    @Override
    public Optional<DiaryEmotionEntity> findById(Integer id){
        return diaryEmotionRepository.findById(id);
    }


}
