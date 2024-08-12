package com.example.happyre.controller;

import com.example.happyre.service.UserAvgService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Keyword")
@RestController
@RequestMapping("/api/useravg")
@RequiredArgsConstructor
public class UserAvgController {
    private final UserAvgService userAvgService;

    @GetMapping
    public ResponseEntity<?> getUserAvg(HttpServletRequest request) {
        return ResponseEntity.ok().body(userAvgService.getUserAvgEntityByReq(request));

    }
}
