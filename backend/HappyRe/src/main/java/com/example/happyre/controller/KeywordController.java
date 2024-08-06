package com.example.happyre.controller;


import com.example.happyre.dto.keyword.KeywordEntityDTO;
import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.service.DiaryService;
import com.example.happyre.service.KeywordService;
import com.example.happyre.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@Tag(name = "Keywords")
@RestController
@RequestMapping("/api/keyword")
@RequiredArgsConstructor
public class KeywordController {

    private final KeywordService keywordService;
    private final DiaryService diaryService;
    private final UserService userService;

    @Operation(summary = "오늘자 Diary에 Keyword 생성하기", description = "참고: 오늘자 Diary가 없으면 생성합니다.")
    @PostMapping("/")
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


}
