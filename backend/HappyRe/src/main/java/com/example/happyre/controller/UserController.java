package com.example.happyre.controller;

import com.example.happyre.dto.JoinUserDTO;

import com.example.happyre.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@ResponseBody
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;


    public UserController(UserService userService) {
        this.userService = userService;
    }


    //유저정보 조회
    @GetMapping("/")
    public String getUser() {


        return null;
    }
    //유저정보 수정
    @PostMapping("/")
    public String modifyUser() {
        return null;
    }
    //회원 탈퇴
    @DeleteMapping("/")
    public String deleteUser() {
        return null;
    }
    //유저정보 등록 (회원가입)
    @PostMapping("/join")
    public String joinUser(@RequestBody JoinUserDTO joinUserDTO) {
        System.out.println(joinUserDTO);
        userService.joinProcess(joinUserDTO);
        return null;
    }

}
