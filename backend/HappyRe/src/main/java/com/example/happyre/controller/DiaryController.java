package com.example.happyre.controller;

import com.example.happyre.dto.diary.ReportResponse;
import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.service.DiaryService;
import com.example.happyre.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Tag(name = "Diary")
@RestController
@RequestMapping("/api/diary")
@RequiredArgsConstructor
public class DiaryController {

    private static final Logger logger = LoggerFactory.getLogger(DiaryController.class);//no useage, just in case

    private final DiaryService diaryService;
    private final UserService userService;

    @PostMapping("/")
    public ResponseEntity<?> addDiary(HttpServletRequest request, @RequestBody ReportResponse reportResponse) {
        try {
            UserEntity userEntity = userService.findByRequest(request);
            DiaryEntity diaryEntity = new DiaryEntity();
            diaryEntity.setUserEntity(userEntity);
            diaryEntity.setSummary(reportResponse.getSummary());
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

    @GetMapping("/")
    public ResponseEntity<?> getMyDiaries(HttpServletRequest request) {
        try {
            UserEntity userEntity = userService.findByRequest(request);
            List<DiaryEntity> diaries = diaryService.findByUserEntity(userEntity);
            return ResponseEntity.ok(diaries);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Diary 가져오는중 에러: " + e.getMessage());
        }
    }

    @PutMapping("/{diaryId}")
    public ResponseEntity<?> editDiary(HttpServletRequest request, @PathVariable int diaryId, @RequestBody ReportResponse reportResponse) {
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

            diaryEntity.setSummary(reportResponse.getSummary());
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
