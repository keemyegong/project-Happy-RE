package com.example.happyre.controller;

import com.example.happyre.entity.KeywordEntity;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.entity.UserWordFrequencyEntity;
import com.example.happyre.service.UserService;
import com.example.happyre.service.UserWordFrequencyService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/wordcloud")
@RequiredArgsConstructor
public class WordCloudController {
    private final UserWordFrequencyService userWordFrequencyService;
    private final UserService userService;

    @GetMapping("/mywords")
    public ResponseEntity<?> wordCloud(HttpServletRequest request) {
        System.out.println(" GetUserWordFrequency ");
        try {
            UserEntity userEntity = userService.findByRequest(request);
            System.out.println(" GetUserWordFrequency ");
            if (userEntity == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }
            List<UserWordFrequencyEntity> re = userWordFrequencyService.findUserWordFrequencyByUser(userEntity);
            System.out.println(" GetUserWordFrequency ");
            return new ResponseEntity<>(  re, HttpStatus.OK);

        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }


    }


}
