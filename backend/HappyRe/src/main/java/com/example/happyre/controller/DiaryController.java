package com.example.happyre.controller;

import com.example.happyre.dto.diary.DiaryContentDTO;
import com.example.happyre.dto.diary.DiaryDetailResponseDTO;
import com.example.happyre.dto.diary.DiaryEntityDTO;
import com.example.happyre.dto.diaryemotion.DiaryEmotionDTO;
import com.example.happyre.entity.*;
import com.example.happyre.service.*;
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
import java.util.List;
import java.util.Optional;

@Tag(name = "Diary")
@RestController
@RequestMapping("/api/diary")
@RequiredArgsConstructor
public class DiaryController {

    private static final Logger logger = LoggerFactory.getLogger(DiaryController.class);//no useage, just in case

    private final DiaryService diaryService;
    private final DiaryEmotionService diaryEmotionService;
    private final UserService userService;
    private final MessageService messageService;
    private final KeywordService keywordService;
    private final UserAvgService userAvgService;


    @Operation(summary = "새 Diary 생성", description = "date를 null(빈 string 아님!) 로 설정하면 오늘 날짜로 생성을 시도합니다.\n date format은 yyyy-mm-dd hh:mm:ss 입니다.")
    @PostMapping("/")
    public ResponseEntity<?> addDiary(HttpServletRequest request, @RequestBody DiaryEntityDTO diaryEntityDTO) {
        try {
            UserEntity userEntity = userService.findByRequest(request);
            diaryEntityDTO.setUserId(userEntity.getId());
            return ResponseEntity.ok(diaryService.insertDTO(diaryEntityDTO));
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
            } else {
                //없으면 오늘자로 검색
                UserEntity userEntity = userService.findByRequest(request);
                List<DiaryEntity> list = diaryService.findByUserAndDate(userEntity, Date.valueOf(LocalDate.now()));
                if (list.size() == 0) {
                    return ResponseEntity.ok("No Today Diary");
                }
                diaryEntity = list.get(list.size() - 1);
            }
            List<MessageEntity> byDiaryEntityMessage = messageService.findByDiaryEntity(diaryEntity);
            List<KeywordEntity> byDiaryEntityKeyword = keywordService.findByDiaryEntity(diaryEntity);


            DiaryDetailResponseDTO res = new DiaryDetailResponseDTO(byDiaryEntityMessage, byDiaryEntityKeyword);
            for (int i = 0; i < res.getKeywordEntities().size(); i++) {
                System.out.println("---------------!!!!!!!!!!!!!!!!!!!!11------------------");
                List<EmotionEntity> tmp = keywordService.findEmotionsByKeywordId(res.getKeywordEntities().get(i).getKeywordId());
                System.out.println(tmp.toString());
                res.getKeywordEntities().get(i).setEmotions(tmp);
            }

//            for(KeywordWithEmotionDTO keywordEmotionDTO :res.getKeywordEntities()){
//                System.out.println("---------------!!!!!!!!!!!!!!!!!!!!11------------------");
//                List<EmotionEntity> tmp = keywordService.findEmotionsByKeywordId(keywordEmotionDTO.getKeywordId());
//                System.out.println(tmp.toString());
//                keywordEmotionDTO.setEmotions(tmp);
//            }

            System.out.println(res.toString());
            return ResponseEntity.ok(res);
        } catch (AccessDeniedException ade) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ade.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Diary 가져오는중 에러: " + e.getMessage());
        }
    }

    @GetMapping("/")
    public ResponseEntity<?> getMyDiaries(HttpServletRequest request,
                                          @RequestParam(required = false) Integer year,
                                          @RequestParam(required = false) Integer month,
                                          @RequestParam(required = false) Integer day,
                                          @RequestParam(required = false) Integer period) {
        try {
            UserEntity userEntity = userService.findByRequest(request);
            List<DiaryEntity> diaries;
            if (year != null && month != null && day != null) {
                Date date = Date.valueOf(LocalDate.of(year, month, day));
                diaries = diaryService.searchForWeek(userEntity, date, period);
            } else {
                diaries = diaryService.findByUserEntity(userEntity);

            }
            return ResponseEntity.ok(diaries);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Diary 가져오는중 에러: " + e.getMessage());
        }
    }

    @Operation(summary = "오늘 자 Diary의 내용 수정.", description = "오늘 자 Diary의 내용 수정.")
    @PutMapping("/updatetoday")
    public ResponseEntity<?> updateContent(HttpServletRequest request, @RequestBody DiaryContentDTO diaryContentDTO) {
        try {
            UserEntity userEntity = userService.findByRequest(request);
            List<DiaryEntity> diaryEntityList = diaryService.findByUserAndDate(userEntity, Date.valueOf(LocalDate.now()));
            DiaryEntity diaryEntity;
            if (diaryEntityList.size() == 0) {
                logger.warn("Diary 없음. 새로 만든다.");
                diaryEntity = new DiaryEntity();
                diaryEntity.setUserEntity(userEntity);
                diaryEntity.setSummary(diaryContentDTO.getSummary());
                diaryService.insert(diaryEntity);
            } else {
                diaryEntity = diaryEntityList.get(0);
                if (!userEntity.getId().equals(diaryEntity.getUserEntity().getId())) {
                    throw new AccessDeniedException("권한 없음(유저 불일치)");
                }
                diaryEntity.setSummary(diaryContentDTO.getSummary());
                diaryEntity.setRussellAvgX(diaryContentDTO.getRussellAvgX());
                diaryEntity.setRussellAvgY(diaryContentDTO.getRussellAvgY());
                diaryService.update(diaryEntity);
                userAvgService.setAvg(userEntity.getId(), diaryContentDTO.getRussellAvgX(), diaryContentDTO.getRussellAvgY());
            }
            return ResponseEntity.ok("업데이트 완료");
        } catch (AccessDeniedException ade) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ade.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Diary Content 편집중 에러: " + e.getMessage());
        }
    }

    @Operation(description = "임의 Id의 Diary 내용 수정(권한 필요). null값 주의.")
    @PutMapping("/{diaryId}")
    public ResponseEntity<?> editDiary(HttpServletRequest request, @PathVariable int diaryId, @RequestBody DiaryContentDTO diaryContentDTO) {
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

            diaryEntity.setSummary(diaryContentDTO.getSummary());
            diaryEntity.setRussellAvgX(diaryContentDTO.getRussellAvgX());
            diaryEntity.setRussellAvgY(diaryContentDTO.getRussellAvgY());
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

    //Emotion
    @Operation(summary = "Diary에 Emotion 생성")
    @PostMapping("/emotion")
    public ResponseEntity<?> createEmotion(HttpServletRequest request, @RequestBody DiaryEmotionDTO diaryEmotionDTO) {
        try {
            if (null == diaryEmotionDTO.getDiaryId()) throw new AssertionError();
            DiaryEntity diaryEntity = diaryService.findById(diaryEmotionDTO.getDiaryId()).orElseThrow(() -> new RuntimeException("주어진 id에 해당하는 Diary 객체 없음 "));
            if (diaryEntity.getUserEntity().getId() != userService.findByRequest(request).getId())
                throw new RuntimeException("권한 없음");
            diaryEmotionService.insertDTO(diaryEmotionDTO);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Diary에 Emotion 추가중 에러 : " + e.getMessage());
        }
    }

    @Operation(summary = "DiaryId 로 Emotion 조회")
    @GetMapping("/emotion/diary/{id}")
    public ResponseEntity<?> findEmotionByDiary(HttpServletRequest request, @PathVariable Integer id) {
        try {
            DiaryEntity diaryEntity = diaryService.findById(id).orElseThrow(() -> new RuntimeException("주어진 id에 해당하는 Diary 객체 없음 "));
            if (diaryEntity.getUserEntity().getId() != userService.findByRequest(request).getId())
                throw new RuntimeException("권한 없음");
            return ResponseEntity.ok(diaryEntity.getDiaryEmotionEntityList());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Diary로 Emotion 조회중 에러 : " + e.getMessage());
        }
    }

    @DeleteMapping("/emotion/{id}")
    public ResponseEntity<?> deleteDiaryEmotion(HttpServletRequest request, @PathVariable Integer id) {
        try {
            DiaryEmotionEntity diaryEmotionEntity = diaryEmotionService.findById(id).orElseThrow(() -> new RuntimeException("주어진 id에 해당하는 DiaryEmotion 없음"));
            if (diaryEmotionEntity.getDiaryEntity().getUserEntity().getId() != userService.findByRequest(request).getId())
                throw new RuntimeException("권한 없음");
            diaryEmotionService.delete(diaryEmotionEntity);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Diary Emotion 삭제중 에러 : " + e.getMessage());
        }
    }
}
