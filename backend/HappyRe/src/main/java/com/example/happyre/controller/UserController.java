package com.example.happyre.controller;

import com.example.happyre.dto.user.JoinUserDTO;

import com.example.happyre.dto.user.ModifyUserDTO;
import com.example.happyre.dto.user.UserWithProfile;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;

@Tag(name = "User")
@Controller
@ResponseBody
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    //유저정보 조회
    @GetMapping("/me")
    public ResponseEntity<?> getUser(HttpServletRequest request) {
        try{
            UserEntity userEntity = userService.findInfoByEmail(request);
            return new ResponseEntity<>(userEntity, HttpStatus.OK);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

    }
    @GetMapping("/profileimg")
    public ResponseEntity<?> getProfileImg(HttpServletRequest request) {
        try {
            Resource resource = userService.myProfile(request);

            if (resource == null || !resource.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // MIME 타입 설정 (파일 확장자에 따라 다를 수 있음)
            String contentType = Files.probeContentType(Paths.get(resource.getURI()));

            if (contentType == null) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE; // 기본 MIME 타입
            }

            // HTTP 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.setContentLength(resource.contentLength()); // 파일 크기 설정
            headers.setContentDisposition(ContentDisposition.inline().filename(resource.getFilename()).build()); // 파일 이름 설정
            System.out.println("정상적입니다");
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(resource);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //유저정보 수정
    @PutMapping("/me")
    public ResponseEntity<?> modifyUser(HttpServletRequest request, @RequestBody ModifyUserDTO modifyUserDTO) {
        try {
            System.out.println("modifyUser Controller ");
            userService.modifyUserInfo(modifyUserDTO, request);
            return ResponseEntity.ok("User updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    //회원 탈퇴
    @DeleteMapping("/me")
    public ResponseEntity<?> deleteUser(HttpServletRequest request) {
        try{
            userService.deleteUserInfo(request);
            return ResponseEntity.ok("User deleted successfully");
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/uploadprofile")
    public ResponseEntity<?> uploadProfile(HttpServletRequest request,@RequestParam("file") MultipartFile file) {
        try{
            userService.uploadProfile(request, file);
            return ResponseEntity.ok("upload profile successfully");
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    //유저정보 등록 (회원가입)
    @PostMapping("/join")
    public ResponseEntity<?> joinUser(@RequestBody JoinUserDTO joinUserDTO) {
        try {
            System.out.println(joinUserDTO);
            userService.joinProcess(joinUserDTO);
            return ResponseEntity.ok("Join process successfully");
        }catch(IllegalStateException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }



    }

    @PutMapping("/russell")
    public  ResponseEntity<?> firstRussell(HttpServletRequest request, @RequestBody Map<String,Double> body){
        try {
            userService.fistRussell(request, body);
            return ResponseEntity.ok("First russell setting successfully");
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }



}
