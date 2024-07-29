package com.example.happyre.service;

import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.repository.DiaryRepository;
import com.example.happyre.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class DiaryServiceImpl implements DiaryService {

    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;

    @Override
    public DiaryEntity insert(DiaryEntity diaryEntity) {
        diaryRepository.save(diaryEntity);
        return null;
    }

    @Override
    public Optional<DiaryEntity> findById(int diaryId) {
        return diaryRepository.findById(diaryId);
    }

    @Override
    public List<DiaryEntity> findByUserEntity(UserEntity userEntity) {
        return diaryRepository.findByUserEntity(userEntity);
    }

    // 오직 Summary만 바꿀 수 있다.
    @Override
    public DiaryEntity update(DiaryEntity diaryDTOEntity) {
        DiaryEntity matchingEntity = diaryRepository.findById(diaryDTOEntity.getDiaryId()).orElseThrow();
        matchingEntity.setSummary(diaryDTOEntity.getSummary());
        return diaryRepository.save(matchingEntity);
    }

    @Override
    public DiaryEntity delete(DiaryEntity diaryDTOEntity) {
        DiaryEntity matchingEntity = diaryRepository.findById(diaryDTOEntity.getDiaryId()).orElseThrow();
        diaryRepository.delete(matchingEntity);
        return matchingEntity;
    }

}
