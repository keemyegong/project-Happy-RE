package com.example.happyre.controller;

import com.example.happyre.dto.diary.ReportResponse;
import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.jwt.JWTUtil;
import com.example.happyre.service.DiaryService;
import com.example.happyre.service.DiaryServiceImpl;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@Tag(name = "Diary")
@RestController
@RequestMapping("/api/diary")
public class DiaryController {

    private final DiaryServiceImpl diaryService;
    private final JWTUtil jwtUtil;

    public DiaryController(DiaryServiceImpl diaryService, JWTUtil jwtUtil){
        this.diaryService = diaryService;
        this.jwtUtil = jwtUtil;

    }

    @GetMapping("/")
    public ResponseEntity<?> getMyDiary(HttpServletRequest request){
        try {
            int userId = jwtUtil.getUserId(request.getHeader("Authorization").substring(7));
            List<DiaryEntity> diaryEntity = diaryService.findByUserId(userId);
            return new ResponseEntity<>(diaryEntity, HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }

    }


    @PostMapping("/report")
    public ResponseEntity<?> addReport(HttpServletRequest request, @RequestBody ReportResponse reportResponse){
        try {
            System.out.println("Controller : addReport");
            int userId = jwtUtil.getUserId(request.getHeader("Authorization").substring(7));

            diaryService.addReport(reportResponse,userId);
            return null;
        }catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }

    }



}
