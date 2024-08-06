package com.example.happyre.controller;

import com.example.happyre.dto.keyword.KeywordEntityDTO;
import com.example.happyre.dto.message.MessageEntityDTO;
import com.example.happyre.dto.report.ReportDTO;
import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.exception.diary.DiaryEntryAlreadyExistsException;
import com.example.happyre.service.DiaryService;
import com.example.happyre.service.KeywordService;
import com.example.happyre.service.MessageService;
import com.example.happyre.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Tag(name = "Report")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/report")
public class ReportController {
    private final MessageService messageService;
    private final DiaryService diaryService;
    private final UserService userService;
    private final KeywordService keywordService;

    @PostMapping()
    ResponseEntity<?> insertReport(HttpServletRequest request, @RequestBody ReportDTO reportDTO) {
        try {
            UserEntity userEntity = userService.findByRequest(request);//TODO: Spring Security 의 SecurityConextHolder를 사용할 수 있을듯?
            if (userEntity == null) throw new Exception("request중인 user가 존재하지 않음!!!");

            DiaryEntity diaryEntity;
            Integer diaryId = reportDTO.getDiaryEntityDTO().getDiaryId();
            if (diaryId == null) {// 새 다이어리 만들거나 오늘자 가져옴.
                try {
                    diaryEntity = diaryService.insertDTO(reportDTO.getDiaryEntityDTO());//만들기
                } catch (DiaryEntryAlreadyExistsException d) {
                    diaryEntity = diaryService.findByUserAndDate(userEntity, Date.valueOf(LocalDate.now())).get(0);//가져오기
                }
                diaryId = diaryEntity.getDiaryId();
            } else {
                diaryEntity = diaryService.findById(diaryId).orElseThrow(() -> new Exception("해당 Id의 Diary가 존재하지 않음!"));
            }

            DiaryEntity finalDiaryEntity = diaryEntity;
            List<MessageEntityDTO> messageEntityDTOList = reportDTO.getMessageEntityDTOList().stream().map(m -> {
                m.setDiaryId(finalDiaryEntity.getDiaryId());
                return m;
            }).toList();

            List<KeywordEntityDTO> keywordEntityDTOList = reportDTO.getKeywordEntityDTOList().stream().map(k -> {
                k.setDiaryId(finalDiaryEntity.getDiaryId());
                return k;
            }).toList();
            messageService.insertDTOList(messageEntityDTOList);
            keywordService.insertDTOList(diaryEntity,keywordEntityDTOList);
            return ResponseEntity.status(HttpStatus.OK).body("Report 등록 완료");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Report 등록 중 에러: " + e.getMessage());
        }
    }

}
