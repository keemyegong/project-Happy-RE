package com.example.happyre.controller;

import com.example.happyre.dto.user.JoinUserDTO;
import com.example.happyre.dto.user.ModifyUserDTO;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.service.UserAvgService;
import com.example.happyre.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    private final UserAvgService userAvgService;


    @GetMapping("/test")
    public ResponseEntity<?> me(HttpServletRequest request) {
        return ResponseEntity.ok().body("test!!!!!!!!!!!!!!");
    }

    //유저정보 조회
    @GetMapping("/me")
    public ResponseEntity<?> getUser(HttpServletRequest request) {
        try {
            UserEntity userEntity = userService.findByRequest(request);
            return new ResponseEntity<>(userEntity, HttpStatus.OK);
        } catch (Exception e) {
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
            System.out.println("parseMediaType :" + MediaType.parseMediaType(contentType));
            headers.setContentLength(resource.contentLength()); // 파일 크기 설정
            System.out.println("resource.contentLength() : " + resource.contentLength());
            headers.setContentDisposition(ContentDisposition.inline().filename(resource.getFilename()).build()); // 파일 이름 설정
            System.out.println("PROFILE IMAGE LOAD Success");
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(resource);

        } catch (IOException e) {
            System.out.println("PROFILE IMAGE LOAD ERROR: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
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
        try {
            userService.deleteUserInfo(request);
            return ResponseEntity.ok("User deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/uploadprofile")
    public ResponseEntity<?> uploadProfile(HttpServletRequest request, @RequestParam("file") MultipartFile file) {
        try {
            System.out.println("uploadProfile Controller Successful connect");
            userService.uploadProfile(request, file);
            return ResponseEntity.ok("upload profile successfully");
        } catch (RuntimeException e) {
            System.out.println("upload profile ERROR: " + e.getMessage());
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
        } catch (IllegalAccessException e) {
            //409 : aleady exist user
            System.out.println("IllegalStateException : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (RuntimeException e) {
            //400 : email validation
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            //500 IO error
            System.out.println("Exception : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }


    }

    @PutMapping("/russell")
    public ResponseEntity<?> firstRussell(HttpServletRequest request, @RequestBody Map<String, Double> body) {
        try {
            userService.fistRussell(request, body);
            userAvgService.setAvgByReq(request , body.get("x"), body.get("y"));
            return ResponseEntity.ok("First russell setting successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


}
