package com.example.happyre.controller;


import com.example.happyre.dto.keyword.KeywordEntityDTO;
import com.example.happyre.dto.message.MessageEntityDTO;
import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.KeywordEntity;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.service.DiaryService;
import com.example.happyre.service.KeywordService;
import com.example.happyre.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/keyword")
@RequiredArgsConstructor
public class KeywordController {

    private final KeywordService keywordService;
    private final DiaryService diaryService;
    private final UserService userService;


    @PostMapping()
    public ResponseEntity<?> createKeyword(HttpServletRequest request, @RequestBody List<KeywordEntityDTO> KeywordEntityDTO) {
        System.out.println("createkeywords :"+KeywordEntityDTO.toString() );
        try {
            UserEntity userEntity = userService.findByRequest(request);
            if(userEntity == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }
            System.out.println("user Entity : "+userEntity.toString());
            LocalDate today = LocalDate.now();
            List<DiaryEntity> todayDiarys =  diaryService.findByUserAndDate(userEntity ,  java.sql.Date.valueOf(today));
            if(todayDiarys.isEmpty()) {
                //만들고 시작
                DiaryEntity diaryEntity = new DiaryEntity();
                diaryEntity.setUserEntity(userEntity);
                todayDiarys.add(diaryService.insert(diaryEntity)) ;
            }
            DiaryEntity diaryEntity=todayDiarys.get(0);
            System.out.println("Diary Entity : "+ diaryEntity.toString());
            keywordService.insertDTOList(diaryEntity,KeywordEntityDTO);


            return ResponseEntity.ok("Successfully created keywords");
        } catch (Exception e) {
            System.out.println("Keyword insert ERROR : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Keywords 생성중 에러: " + e.getMessage());
        }
    }


    @PutMapping("/{keywordId}")
    public ResponseEntity<?> updateArchived(HttpServletRequest request,
                                           @PathVariable Integer keywordId,
                                           @RequestParam(required = true) Boolean archived){
        try{
            keywordService.updateArchive(keywordId, archived);
            return ResponseEntity.ok("Successfully updated message");
        }catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Message Not Found : " + e.getMessage());
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error : " + e.getMessage());
        }

    }



}
