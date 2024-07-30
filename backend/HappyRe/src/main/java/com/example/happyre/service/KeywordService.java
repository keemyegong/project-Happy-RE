package com.example.happyre.service;

import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.KeywordEntity;
import com.example.happyre.entity.UserEntity;

import java.util.List;
import java.util.Optional;

public interface KeywordService {

    KeywordEntity insert(KeywordEntity keywordEntity);

    Optional<KeywordEntity> findById(int keywordId);

    List<KeywordEntity> findByDiaryEntity(DiaryEntity diaryEntity);

    List<KeywordEntity> findByKeywordAndUserEntity(String keyword, UserEntity userEntity);

    KeywordEntity update(KeywordEntity keywordDTOEntity);

    void delete(KeywordEntity keywordEntity);

}
