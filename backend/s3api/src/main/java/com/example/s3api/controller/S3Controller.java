package com.example.s3api.controller;

import com.example.s3api.service.S3Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/s3")
public class S3Controller {

    private S3Service s3Service;
    public S3Controller(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @PostMapping("/upload")
    public String upload(@RequestParam("file") MultipartFile file) {
        try {
            s3Service.uploadFile(file.getOriginalFilename(), file.getInputStream(), file.getSize());
            return "파일이 성공적으로 업로드되었습니다.";
        } catch (IOException e) {
            return "파일 업로드 중 오류 발생: " + e.getMessage();
        }
    }



}
