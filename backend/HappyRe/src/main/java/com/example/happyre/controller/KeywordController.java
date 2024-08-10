package com.example.happyre.controller;


import com.example.happyre.dto.keyword.KeywordEntityDTO;
import com.example.happyre.dto.keywordemotion.KeywordEmotionDTO;
import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.KeywordEmotionEntity;
import com.example.happyre.entity.KeywordEntity;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.service.DiaryService;
import com.example.happyre.service.KeywordEmotionService;
import com.example.happyre.service.KeywordService;
import com.example.happyre.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Tag(name = "Keyword")
@RestController
@RequestMapping("/api/keyword")
@RequiredArgsConstructor
public class KeywordController {

    private final KeywordService keywordService;
    private final DiaryService diaryService;
    private final UserService userService;
    private final KeywordEmotionService keywordEmotionService;


    @GetMapping()
    public ResponseEntity<?> getMyKeywords(HttpServletRequest request) {
        System.out.println(" Get My Keywords ");
        try {
            UserEntity userEntity = userService.findByRequest(request);
            if (userEntity == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }
            List<KeywordEntity> keywordEntityList = keywordService.getMyKeywords(userEntity);
            return new ResponseEntity<>(keywordEntityList, HttpStatus.OK);

        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/keywordName/{keyword}")
    public ResponseEntity<?> findByKeywordName(HttpServletRequest request, @PathVariable String keyword) {
        System.out.println(" findByKeywordName ");
        System.out.println(" findByKeywordName ");
        System.out.println(" findByKeywordName ");
        try {
            UserEntity userEntity = userService.findByRequest(request);
            if (userEntity == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }
            List<KeywordEntity> keywordEntityList = keywordService.findByKeywordAndUserEntity(keyword.strip(), userEntity);
            return new ResponseEntity<>(keywordEntityList, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(e.getStackTrace(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(e.getStackTrace(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/cloud")
    public ResponseEntity<?> getMyWordCloud(HttpServletRequest request) {
        System.out.println(" GetMyWordCloud ");
        try {
            UserEntity userEntity = userService.findByRequest(request);
            if (userEntity == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }
            List<KeywordEntity> keywordEntityList = keywordService.getMyKeywords(userEntity);
            return new ResponseEntity<>(keywordEntityList, HttpStatus.OK);

        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Operation(summary = "오늘자 Diary에 Keyword 생성하기", description = "참고: 오늘자 Diary가 없으면 생성합니다.")
    @PostMapping()
    public ResponseEntity<?> createKeyword(HttpServletRequest request, @RequestBody List<KeywordEntityDTO> KeywordEntityDTO) {
        System.out.println("createkeywords :" + KeywordEntityDTO.toString());
        try {
            UserEntity userEntity = userService.findByRequest(request);
            if (userEntity == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }
            System.out.println("user Entity : " + userEntity.toString());
            LocalDate today = LocalDate.now();
            List<DiaryEntity> todayDiarys = diaryService.findByUserAndDate(userEntity, java.sql.Date.valueOf(today));
            if (todayDiarys.isEmpty()) {
                //만들고 시작
                DiaryEntity diaryEntity = new DiaryEntity();
                diaryEntity.setUserEntity(userEntity);
                todayDiarys.add(diaryService.insert(diaryEntity));
            }
            DiaryEntity diaryEntity = todayDiarys.get(0);
            System.out.println("Diary Entity : " + diaryEntity.toString());
            keywordService.insertDTOList(diaryEntity, KeywordEntityDTO);


            return ResponseEntity.ok("Successfully created keywords");
        } catch (Exception e) {
            System.out.println("Keyword insert ERROR : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Keywords 생성중 에러: " + e.getMessage());
        }
    }

    @Operation(summary = "Archive 상태 변경", description = "참고: 현재 User Authorization을 확인하지 않는 문제가 있습니다(다른 유저 것이여도 수정 가능함)")
    @PutMapping("/{keywordId}")
    public ResponseEntity<?> updateArchived(HttpServletRequest request,
                                            @PathVariable Integer keywordId,
                                            @RequestParam(required = true) Boolean archived) {
        try {
            keywordService.updateArchive(keywordId, archived);
            return ResponseEntity.ok("Successfully updated message");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Message Not Found : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error : " + e.getMessage());
        }

    }

    //Emotion
    @Operation(summary = "Emotion 생성")
    @PostMapping("/emotion")
    public ResponseEntity<?> createEmotion(HttpServletRequest request, @RequestBody KeywordEmotionDTO keywordEmotionDTO) {
        try {
            if (null == keywordEmotionDTO.getKeywordId()) throw new AssertionError();
            KeywordEntity keywordEntity = keywordService.findById(keywordEmotionDTO.getKeywordId()).orElseThrow(() -> new RuntimeException("주어진 id에 해당하는 Keyword 객체 없음 "));
            if (keywordEntity.getDiaryEntity().getUserEntity().getId() != userService.findByRequest(request).getId())
                throw new RuntimeException("권한 없음");
            keywordEmotionService.insertDTO(keywordEmotionDTO);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Emotion 추가중 에러 : " + e.getMessage());
        }
    }

    @Operation(summary = "keywordId로 Emotion 조회")
    @GetMapping("/emotion/keyword/{id}")
    public ResponseEntity<?> findEmotionByKeyword(HttpServletRequest request, @PathVariable Integer id) {
        try {
            KeywordEntity keywordEntity = keywordService.findById(id).orElseThrow(() -> new RuntimeException("주어진 id에 해당하는 Keyword 객체 없음 "));
            if (keywordEntity.getDiaryEntity().getUserEntity().getId() != userService.findByRequest(request).getId())
                throw new RuntimeException("권한 없음");
            return ResponseEntity.ok(keywordEntity.getKeywordEmotionEntityList());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Emotion 조회중 에러 : " + e.getMessage());
        }
    }

    @DeleteMapping("/emotion/{id}")
    public ResponseEntity<?> deleteKeywordEmotion(HttpServletRequest request, @PathVariable Integer id) {
        try {
            KeywordEmotionEntity keywordEmotionEntity = keywordEmotionService.findById(id).orElseThrow(() -> new RuntimeException("주어진 id에 해당하는 keywordEmotion 없음"));
            if (keywordEmotionEntity.getKeywordEntity().getDiaryEntity().getUserEntity().getId() != userService.findByRequest(request).getId())
                throw new RuntimeException("권한 없음");
            keywordEmotionService.delete(keywordEmotionEntity);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Emotion 삭제중 에러 : " + e.getMessage());
        }
    }
}
