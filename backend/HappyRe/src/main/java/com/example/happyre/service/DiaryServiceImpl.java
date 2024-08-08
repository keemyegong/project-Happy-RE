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
import java.sql.Timestamp;
import java.util.Calendar;
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
        if(diaryEntity.getDate() == null) diaryEntity.onCreate();
        List<DiaryEntity> thatDayDiary = diaryRepository.findByUserEntityAndDate(diaryEntity.getUserEntity(), new Date(diaryEntity.getDate().getTime()));
        if (thatDayDiary.size() != 0) throw new DiaryEntryAlreadyExistsException("같은 날짜의 Diary 가 이미 존재함");
        return diaryRepository.save(diaryEntity);
    }

    @Override
    public DiaryEntity insertDTO(DiaryEntityDTO diaryEntityDTO) throws Exception {
        UserEntity userEntity = userService.findById(diaryEntityDTO.getUserId()).orElseThrow(() -> new Exception("User가 존재하지 않음!"));
        DiaryEntity diaryEntity = new DiaryEntity();
        diaryEntity.setUserEntity(userEntity);
        diaryEntity.setSummary(diaryEntityDTO.getSummary());
        diaryEntity.setRussellAvgX(diaryEntityDTO.getRussellAvgX());
        diaryEntity.setRussellAvgY(diaryEntityDTO.getRussellAvgY());
        if(diaryEntityDTO.getDate() != null){
            diaryEntity.setDate(Timestamp.valueOf(diaryEntityDTO.getDate()));
        }
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

    @Override
    public DiaryEntity update(DiaryEntity diaryDTOEntity) {
        DiaryEntity matchingEntity = diaryRepository.findById(diaryDTOEntity.getDiaryId()).orElseThrow();
        matchingEntity.setSummary(diaryDTOEntity.getSummary());
        matchingEntity.setRussellAvgX(diaryDTOEntity.getRussellAvgX());
        matchingEntity.setRussellAvgY(diaryDTOEntity.getRussellAvgY());
        return diaryRepository.save(matchingEntity);
    }

    @Override
    public void delete(DiaryEntity diaryDTOEntity) {
        DiaryEntity matchingEntity = diaryRepository.findById(diaryDTOEntity.getDiaryId()).orElseThrow();
        diaryRepository.delete(matchingEntity);
    }

    @Override
    public List<DiaryEntity> searchForWeek(UserEntity userEntity, Date date, Integer period) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DAY_OF_YEAR, period);
        Date endDate = new Date(calendar.getTimeInMillis());
        return diaryRepository.findByUserEntityAndDateRange(userEntity, date, endDate);
    }


}
