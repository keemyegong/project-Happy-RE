package com.example.happyre.service;

import com.example.happyre.dto.diary.DiaryEntityDTO;
import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.exception.diary.DiaryEntryAlreadyExistsException;
import com.example.happyre.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Transactional
@RequiredArgsConstructor
@Service
public class DiaryServiceImpl implements DiaryService {

    private final DiaryRepository diaryRepository;
    private final UserService userService;

    @Override
    public DiaryEntity insert(DiaryEntity diaryEntity) {
        //중복 체크
        Date currentDate = Date.valueOf(LocalDate.now());
        List<DiaryEntity> todayDiary = diaryRepository.findByUserEntityAndDate(diaryEntity.getUserEntity(), currentDate);
        if (todayDiary.size() != 0) throw new DiaryEntryAlreadyExistsException("같은 날짜의 Diary 가 이미 존재함");
        //Save 한 뒤, SQL 에서 지정해준 Date 값을 사용하기 위해 재 Fetch.
        return diaryRepository.findById(diaryRepository.save(diaryEntity).getDiaryId()).get();
    }

    @Override
    public DiaryEntity insertDTO(DiaryEntityDTO diaryEntityDTO) throws Exception {
        UserEntity userEntity = userService.findById(diaryEntityDTO.getUserId()).orElseThrow(() -> new Exception("User가 존재하지 않음!"));
        DiaryEntity diaryEntity = new DiaryEntity();
        diaryEntity.setUserEntity(userEntity);
        diaryEntity.setSummary(diaryEntityDTO.getSummary());
        return this.insert(diaryEntity);
    }

    @Override
    public Optional<DiaryEntity> findById(int diaryId) {
        return diaryRepository.findById(diaryId);
    }

    @Override
    public List<DiaryEntity> findByUserAndDate(UserEntity userEntity, Date date) {
        return diaryRepository.findByUserEntityAndDate(userEntity, date);
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
    public void delete(DiaryEntity diaryDTOEntity) {
        DiaryEntity matchingEntity = diaryRepository.findById(diaryDTOEntity.getDiaryId()).orElseThrow();
        diaryRepository.delete(matchingEntity);
    }


}
