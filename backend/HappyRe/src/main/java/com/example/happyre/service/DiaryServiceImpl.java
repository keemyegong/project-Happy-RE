package com.example.happyre.service;

import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class DiaryServiceImpl {

    private final DiaryRepository diaryRepository;




    public List<DiaryEntity> findByUserId(int userid) {
        return diaryRepository.findByUserId(userid);
    }


    public List<DiaryEntity> findAll() {
        return diaryRepository.findAll();
    }




    public DiaryEntity update(DiaryEntity diaryDTOEntity) {
        DiaryEntity matchingEntity = diaryRepository.findById(diaryDTOEntity.getDiaryId()).get();
        matchingEntity.setSummary(diaryDTOEntity.getSummary());
        return diaryRepository.save(matchingEntity);
    }


    public void delete(int id) {
        DiaryEntity matchingEntity = diaryRepository.findById(id).get();
        diaryRepository.delete(matchingEntity);
    }

}
