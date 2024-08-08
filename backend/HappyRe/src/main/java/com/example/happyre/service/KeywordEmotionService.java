package com.example.happyre.service;

import com.example.happyre.dto.keywordemotion.KeywordEmotionDTO;
import com.example.happyre.entity.KeywordEmotionEntity;
import com.example.happyre.entity.KeywordEntity;

import java.util.List;
import java.util.Optional;

public interface KeywordEmotionService {
    KeywordEmotionEntity insert(KeywordEmotionEntity KeywordEmotionEntity);

    KeywordEmotionEntity insertDTO(KeywordEmotionDTO keywordEmotionDTO);

    Optional<KeywordEmotionEntity> findById(Integer id);

    List<KeywordEmotionEntity> findByKeywordAndEmotionString(KeywordEntity keywordEntity, String emotionName);

    void delete(KeywordEmotionEntity keywordEmotionEntity);
}
