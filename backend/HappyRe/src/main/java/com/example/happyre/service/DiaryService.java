package com.example.happyre.service;

import com.example.happyre.entity.DiaryEntity;

import java.util.List;
import java.util.Optional;

public interface DiaryService {

    //### Spring Data JPA Repository 에서 기본으로 만들어주는 Method들의 Wrapper
    Optional<DiaryEntity> findById(int id);

    List<DiaryEntity> findAll();

    DiaryEntity insert(DiaryEntity diaryEntity);

    DiaryEntity update(DiaryEntity diaryDTOEntity);

    void delete(int id);

}
