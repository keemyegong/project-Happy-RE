package com.example.happyre.service;

import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.UserEntity;

import java.util.List;
import java.util.Optional;

public interface DiaryService {

    DiaryEntity insert(DiaryEntity diaryEntity);

    Optional<DiaryEntity> findById(int diaryId);

    List<DiaryEntity> findByUserEntity(UserEntity userEntity);

    DiaryEntity update(DiaryEntity diaryDTOEntity);

    void delete(DiaryEntity diaryDTOEntity);

}
