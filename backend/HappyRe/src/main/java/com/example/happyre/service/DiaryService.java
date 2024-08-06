package com.example.happyre.service;

import com.example.happyre.dto.diary.DiaryEntityDTO;
import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.UserEntity;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

public interface DiaryService {

    DiaryEntity insert(DiaryEntity diaryEntity);

    DiaryEntity insertDTO(DiaryEntityDTO diaryEntityDTO) throws Exception;

    Optional<DiaryEntity> findById(int diaryId);

    public List<DiaryEntity> findByUserAndDate(UserEntity userEntity, Date date);

    List<DiaryEntity> findByUserEntity(UserEntity userEntity);

    DiaryEntity update(DiaryEntity diaryDTOEntity);

    void delete(DiaryEntity diaryDTOEntity);

}
