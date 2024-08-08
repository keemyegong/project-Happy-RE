package com.example.happyre.service;

import com.example.happyre.dto.diaryemotion.DiaryEmotionDTO;
import com.example.happyre.entity.DiaryEmotionEntity;
import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.repository.DiaryEmotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
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
    public DiaryEmotionEntity insertDTO(DiaryEmotionDTO diaryEmotionDTO){
        if(diaryEmotionDTO.getEmotion() == null) throw new AssertionError();
        if(diaryEmotionDTO.getDiaryId() == null) throw new AssertionError();
        DiaryEmotionEntity diaryEmotionEntity = new DiaryEmotionEntity();
        diaryEmotionEntity.setEmotionEntity(emotionService.insertEmotion(diaryEmotionDTO.getEmotion()));
        DiaryEntity diaryEntity = diaryService.findById(diaryEmotionDTO.getDiaryId()).orElseThrow(() -> new RuntimeException("Diary 없음"));
        if(!findByDiaryAndEmotionString(diaryEntity, diaryEmotionEntity.getEmotionEntity().getEmotion()).isEmpty()) throw new RuntimeException("동일한 Diary에 동일한 emotion 이 매핑된 DiaryEmotion이 이미 존재함.");
        diaryEmotionEntity.setDiaryEntity(diaryEntity);
        return insert(diaryEmotionEntity);
    }

    @Override
    public Optional<DiaryEmotionEntity> findById(Integer id){
        return diaryEmotionRepository.findById(id);
    }

    @Override
    public List<DiaryEmotionEntity> findByDiaryAndEmotionString(DiaryEntity diaryEntity, String emotionName){
        return diaryEmotionRepository.findByDiaryAndEmotionString(diaryEntity, emotionName);
    }

    @Override
    public void delete(DiaryEmotionEntity diaryEmotionEntity){
        diaryEmotionRepository.delete(diaryEmotionEntity);
    }
}
