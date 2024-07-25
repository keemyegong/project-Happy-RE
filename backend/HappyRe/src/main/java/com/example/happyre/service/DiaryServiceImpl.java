package com.example.happyre.service;

import com.example.happyre.dto.diary.KeyWordResponse;
import com.example.happyre.dto.diary.ReportResponse;
import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.KeywordEntity;
import com.example.happyre.repository.DiaryRepository;
import com.example.happyre.repository.KeywordRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.engine.jdbc.env.spi.AnsiSqlKeywords;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class DiaryServiceImpl {

    private final DiaryRepository diaryRepository;
    private final KeywordRepository keywordRepository;


    public List<DiaryEntity> findByUserId(int userid) {
        return diaryRepository.findByUserId(userid);
    }

    public void addReport(ReportResponse reportResponse, int userId){
        reportResponse.getSummary();
        reportResponse.getKeywords();
        // 다이어리 먼저 생성
        DiaryEntity diaryEntity = new DiaryEntity();
        diaryEntity.setSummary(reportResponse.getSummary());
        diaryEntity.setUserId(userId);
        diaryEntity = diaryRepository.save(diaryEntity);

        int diaryKey = diaryEntity.getDiaryId();

        System.out.println("Diary ID: " + diaryKey);
        //키워드 저장
        KeywordEntity keywordEntity;
        int sequence = 0;
        for(KeyWordResponse keyWordResponse : reportResponse.getKeywords()){
            keywordEntity = new KeywordEntity();
            keywordEntity.setDiary_id(diaryKey);
            keywordEntity.setSummary(keyWordResponse.getSummary());
            keywordEntity.setKeyword(keyWordResponse.getKeyword());
            keywordEntity.setRussellX(keyWordResponse.getRussellx());
            keywordEntity.setRusselly(keyWordResponse.getRusselly());
            keywordEntity.setSequence(++sequence);
            keywordRepository.save(keywordEntity);
        }
        //emotion 설정





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
