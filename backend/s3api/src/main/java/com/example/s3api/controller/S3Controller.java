package com.example.s3api.controller;

import com.example.s3api.service.S3Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController("/s3")
public class S3Controller {

    private S3Service s3Service;
    public S3Controller(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @PostMapping("/")
    public String upload(@RequestParam("file") MultipartFile file) {
        try {
            File tempFile = File.createTempFile("temp", file.getOriginalFilename());
            file.transferTo(tempFile);
            s3Service.uploadFile(file.getOriginalFilename(), tempFile.getAbsolutePath());
            return "파일이 성공적으로 업로드되었습니다.";

        }catch (IOException e){
            return e.getMessage();
        }

    }



}
