package com.example.happyre.service;

import com.example.happyre.dto.keywordemotion.KeywordEmotionDTO;
import com.example.happyre.entity.KeywordEmotionEntity;
import com.example.happyre.entity.KeywordEntity;
import com.example.happyre.repository.KeywordEmotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class KeywordEmotionServiceImpl implements KeywordEmotionService {

    private final KeywordEmotionRepository keywordEmotionRepository;
    private final EmotionService emotionService;
    private final KeywordService keywordService;

    @Override
    public KeywordEmotionEntity insert(KeywordEmotionEntity KeywordEmotionEntity) {
        if (KeywordEmotionEntity.getKeywordEntity() == null) throw new AssertionError();
        if (KeywordEmotionEntity.getEmotionEntity() == null) throw new AssertionError();
        return keywordEmotionRepository.save(KeywordEmotionEntity);
    }

    @Override
    public KeywordEmotionEntity insertDTO(KeywordEmotionDTO keywordEmotionDTO) {
        if (keywordEmotionDTO.getEmotion() == null) throw new AssertionError();
        if (keywordEmotionDTO.getKeywordId() == null) throw new AssertionError();
        KeywordEmotionEntity KeywordEmotionEntity = new KeywordEmotionEntity();
        KeywordEmotionEntity.setEmotionEntity(emotionService.insertEmotion(keywordEmotionDTO.getEmotion()));
        KeywordEntity keywordEntity = keywordService.findById(keywordEmotionDTO.getKeywordId()).orElseThrow(() -> new RuntimeException("Keyword 없음"));
        if (!findByKeywordAndEmotionString(keywordEntity, KeywordEmotionEntity.getEmotionEntity().getEmotion()).isEmpty())
            throw new RuntimeException("동일한 Keyword에 동일한 emotion 이 매핑된 keywordEmotion이 이미 존재함.");
        KeywordEmotionEntity.setKeywordEntity(keywordEntity);
        return insert(KeywordEmotionEntity);
    }

    @Override
    public Optional<KeywordEmotionEntity> findById(Integer id) {
        return keywordEmotionRepository.findById(id);
    }

    @Override
    public List<KeywordEmotionEntity> findByKeywordAndEmotionString(KeywordEntity keywordEntity, String emotionName) {
        return keywordEmotionRepository.findByKeywordAndEmotionString(keywordEntity, emotionName);
    }

    @Override
    public void delete(KeywordEmotionEntity keywordEmotionEntity) {
        keywordEmotionRepository.delete(keywordEmotionEntity);
    }
}
