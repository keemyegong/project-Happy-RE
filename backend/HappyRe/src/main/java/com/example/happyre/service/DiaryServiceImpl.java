package com.example.happyre.service;

import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class DiaryServiceImpl implements DiaryService{

    private final DiaryRepository diaryRepository;

    @Override
    public Optional<DiaryEntity> findById(int id) {
        return diaryRepository.findById(id);
    }

    @Override
    public List<DiaryEntity> findAll() {
        return diaryRepository.findAll();
    }

    @Override
    public DiaryEntity insert(DiaryEntity diaryEntity) {
        return findById(diaryRepository.save(diaryEntity).getDiaryId()).get();//TODO: Return되는 DiaryEntity의 date 값이 항상 null임.(DB에는 정상적으로 date 생성됨)
    }

    @Override
    public DiaryEntity update(DiaryEntity diaryDTOEntity) {
        DiaryEntity matchingEntity = diaryRepository.findById(diaryDTOEntity.getDiaryId()).get();
        matchingEntity.setSummary(diaryDTOEntity.getSummary());
        return diaryRepository.save(matchingEntity);
    }

    @Override
    public void delete(int id) {
        DiaryEntity matchingEntity = diaryRepository.findById(id).get();
        diaryRepository.delete(matchingEntity);
    }

}
