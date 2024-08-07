package com.example.happyre.controller;

import com.example.happyre.dto.diary.DiaryDetailResponseDTO;
import com.example.happyre.dto.diary.DiaryEntityDTO;
import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.KeywordEntity;
import com.example.happyre.entity.MessageEntity;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.service.DiaryService;
import com.example.happyre.service.KeywordService;
import com.example.happyre.service.MessageService;
import com.example.happyre.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Tag(name = "Diary")
@RestController
@RequestMapping("/api/diary")
@RequiredArgsConstructor
public class DiaryController {

    private static final Logger logger = LoggerFactory.getLogger(DiaryController.class);//no useage, just in case

    private final DiaryService diaryService;
    private final UserService userService;
    private final MessageService messageService;
    private final KeywordService keywordService;

    @PostMapping("/")
    public ResponseEntity<?> addDiary(HttpServletRequest request, @RequestBody DiaryEntityDTO diaryEntityDTO) {
        try {
            UserEntity userEntity = userService.findByRequest(request);
            DiaryEntity diaryEntity = new DiaryEntity();
            diaryEntity.setUserEntity(userEntity);
            diaryEntity.setSummary(diaryEntityDTO.getSummary());
            DiaryEntity savedDiary = diaryService.insert(diaryEntity);
            return ResponseEntity.ok(savedDiary);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Diary 추가중 에러: " + e.getMessage());
        }
    }





    @GetMapping("/{diaryId}")
    public ResponseEntity<?> getDiary(HttpServletRequest request, @PathVariable int diaryId) {
        try {
            Optional<DiaryEntity> optionalDiary = diaryService.findById(diaryId);
            if (optionalDiary.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Diary 없음");
            }

            DiaryEntity diaryEntity = optionalDiary.get();
            UserEntity userEntity = userService.findByRequest(request);
            if (!userEntity.getId().equals(diaryEntity.getUserEntity().getId())) {
                throw new AccessDeniedException("권한 없음(유저 불일치)");
            }

            return ResponseEntity.ok(diaryEntity);
        } catch (AccessDeniedException ade) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ade.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Diary 가져오는중 에러: " + e.getMessage());
        }
    }
    @Operation(summary = "Diary 요약 수정", description = "오늘 자 Diary의 요약 수정.")
    @PutMapping("/updatesummary")
    public ResponseEntity<?> updateSummary(HttpServletRequest request, @RequestParam("summary") String summary) {
        try {
            UserEntity userEntity = userService.findByRequest(request);
            List<DiaryEntity> diaryEntityList = diaryService.findByUserAndDate(userEntity, Date.valueOf(LocalDate.now()));
            DiaryEntity diaryEntity;
            if (diaryEntityList.size() == 0) {
                logger.warn("Diary 없음. 새로 만든다.");
                diaryEntity = new DiaryEntity();
                diaryEntity.setUserEntity(userEntity);
                diaryEntity.setSummary(summary);
                diaryService.insert(diaryEntity);
            } else {
                diaryEntity = diaryEntityList.get(0);
                diaryEntity.setSummary(summary);
                diaryService.update(diaryEntity);
            }
            return ResponseEntity.ok("업데이트 완료");
        } catch (AccessDeniedException ade) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ade.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Diary Summary 편집중 에러: " + e.getMessage());
        }
    }



    @GetMapping("/detail/")
    public ResponseEntity<?> getDiaryDetail(HttpServletRequest request,
                                      @RequestParam(required = false) Integer diaryid) {
        try {
            DiaryEntity diaryEntity;
            if (diaryid != null) {
                Optional<DiaryEntity> optionalDiary = diaryService.findById(diaryid);
                if (optionalDiary.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Diary 없음");
                }

                diaryEntity = optionalDiary.get();
            }else{
                //없으면 오늘자로 검색
                UserEntity userEntity = userService.findByRequest(request);
                List<DiaryEntity> list = diaryService.findByUserAndDate(userEntity, Date.valueOf(LocalDate.now()));
                diaryEntity = list.get(list.size() - 1);
            }
            List<MessageEntity> byDiaryEntityMessage = messageService.findByDiaryEntity(diaryEntity);
            List<KeywordEntity> byDiaryEntityKeword = keywordService.findByDiaryEntity(diaryEntity);

            DiaryDetailResponseDTO respon = new DiaryDetailResponseDTO(byDiaryEntityMessage, byDiaryEntityKeword);
            return ResponseEntity.ok(respon);
        } catch (AccessDeniedException ade) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ade.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Diary 가져오는중 에러: " + e.getMessage());
        }
    }

    @GetMapping("/")
    public ResponseEntity<?> getMyDiaries(HttpServletRequest request,
                                          @RequestParam(required = false) Integer year ,
                                          @RequestParam(required = false) Integer month,
                                          @RequestParam(required = false) Integer day,
                                          @RequestParam(required = false) Integer period ){
        try {
            UserEntity userEntity = userService.findByRequest(request);
            List<DiaryEntity> diaries;
            if(year != null && month != null && day!= null){
                Date date = Date.valueOf(LocalDate.of(year, month, day));
                diaries = diaryService.searchForWeek(userEntity, date, period);
            }else{
                diaries = diaryService.findByUserEntity(userEntity);

            }
            return ResponseEntity.ok(diaries);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Diary 가져오는중 에러: " + e.getMessage());
        }
    }

    @PutMapping("/{diaryId}")
    public ResponseEntity<?> editDiary(HttpServletRequest request, @PathVariable int diaryId, @RequestBody DiaryEntityDTO diaryEntityDTO) {
        try {
            Optional<DiaryEntity> optionalDiary = diaryService.findById(diaryId);
            if (optionalDiary.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Diary 없음");
            }

            DiaryEntity diaryEntity = optionalDiary.get();
            UserEntity userEntity = userService.findByRequest(request);
            if (!userEntity.getId().equals(diaryEntity.getUserEntity().getId())) {
                throw new AccessDeniedException("권한 없음(유저 불일치)");
            }

            diaryEntity.setSummary(diaryEntityDTO.getSummary());
            DiaryEntity updatedDiary = diaryService.update(diaryEntity);
            return ResponseEntity.ok(updatedDiary);
        } catch (AccessDeniedException ade) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ade.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Diary 편집중 에러: " + e.getMessage());
        }
    }

    @DeleteMapping("/{diaryId}")
    public ResponseEntity<?> deleteDiary(HttpServletRequest request, @PathVariable Integer diaryId) {
        try {
            Optional<DiaryEntity> optionalDiary = diaryService.findById(diaryId);
            if (optionalDiary.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Diary 없음");
            }

            DiaryEntity diaryEntity = optionalDiary.get();
            UserEntity userEntity = userService.findByRequest(request);
            if (!userEntity.getId().equals(diaryEntity.getUserEntity().getId())) {
                throw new AccessDeniedException("권한 없음(유저 불일치)");
            }

            diaryService.delete(diaryEntity);
            return ResponseEntity.ok().build();
        } catch (AccessDeniedException ade) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ade.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Diary 삭제중 에러: " + e.getMessage());
        }
    }
}
