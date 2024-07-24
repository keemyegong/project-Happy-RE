package com.example.happyre.controller;

import com.example.happyre.dto.JoinUserDTO;

import com.example.happyre.dto.ModifyUserDTO;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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
        UserEntity userEntity = userService.findInfoByEmail(request);
        if (userEntity != null) {
            return ResponseEntity.ok(userEntity);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    //유저정보 수정
    @PutMapping("/me")
    public ResponseEntity<?> modifyUser(HttpServletRequest request, @RequestBody ModifyUserDTO modifyUserDTO) {
        try {
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


    //유저정보 등록 (회원가입)
    @PostMapping("/join")
    public String joinUser(@RequestBody JoinUserDTO joinUserDTO) {
        System.out.println(joinUserDTO);
        userService.joinProcess(joinUserDTO);
        return null;
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
