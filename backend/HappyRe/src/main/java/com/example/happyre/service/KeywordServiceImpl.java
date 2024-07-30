package com.example.happyre.service;

import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.KeywordEntity;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.repository.DiaryRepository;
import com.example.happyre.repository.KeywordRepository;
import io.jsonwebtoken.lang.Assert;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Data
@Service
public class KeywordServiceImpl implements KeywordService {

    private final KeywordRepository keywordRepository;
    private final DiaryRepository diaryRepository;

    @Override
    public KeywordEntity insert(KeywordEntity keywordEntity) {
        Assert.notNull(keywordEntity.getDiaryEntity(), "keywordEntity.diaryEntity must not be null");
        return keywordRepository.save(keywordEntity);
    }

    @Override
    public Optional<KeywordEntity> findById(int keywordId) {
        return keywordRepository.findById(keywordId);
    }

    @Override
    public List<KeywordEntity> findByDiaryEntity(DiaryEntity diaryEntity) {
        return keywordRepository.findByDiaryEntity(diaryEntity);
    }

    @Override
    public List<KeywordEntity> findByKeywordAndUserEntity(String keyword, UserEntity userEntity) {
        return keywordRepository.findByKeywordAndUserEntity(keyword, userEntity);
    }

    @Override
    public KeywordEntity update(KeywordEntity keywordDTOEntity) {
        KeywordEntity matchingEntity = keywordRepository.findById(keywordDTOEntity.getKeywordId()).orElseThrow();
        matchingEntity.setSequence(keywordDTOEntity.getSequence());
        matchingEntity.setSummary(keywordDTOEntity.getSummary());
        matchingEntity.setRussellX(keywordDTOEntity.getRussellX());
        matchingEntity.setRussellY(keywordDTOEntity.getRussellY());
        return keywordRepository.save(matchingEntity);
    }

    @Override
    public void delete(KeywordEntity keywordDTOEntity) {
        KeywordEntity matchingEntity = keywordRepository.findById(keywordDTOEntity.getKeywordId()).orElseThrow();
        keywordRepository.delete(matchingEntity);
    }
}
