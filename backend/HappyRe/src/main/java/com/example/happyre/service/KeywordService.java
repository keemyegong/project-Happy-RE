package com.example.happyre.service;

import com.example.happyre.dto.keyword.KeywordEntityDTO;
import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.KeywordEntity;
import com.example.happyre.entity.UserEntity;

import java.util.List;
import java.util.Optional;

public interface KeywordService {

    KeywordEntity insert(KeywordEntity keywordEntity);

    KeywordEntity insertDTO(KeywordEntityDTO keywordEntityDTO) throws Exception;

    List<KeywordEntity> insertDTOList(DiaryEntity diaryEntity, List<KeywordEntityDTO> keywordEntityDTOList);

    Optional<KeywordEntity> findById(int keywordId);

    List<KeywordEntity> findByDiaryEntity(DiaryEntity diaryEntity);

    List<KeywordEntity> findByKeywordAndUserEntity(String keyword, UserEntity userEntity);

    List<KeywordEntity> findByArchivedAndUserEntity(Boolean isArchived, UserEntity userEntity);

    KeywordEntity update(KeywordEntity keywordDTOEntity);

    void delete(KeywordEntity keywordEntity);

}
