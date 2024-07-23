package com.example.happyre.service;

import com.example.happyre.dto.JoinUserDTO;
import com.example.happyre.dto.ModifyUserDTO;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public UserEntity findInfoByEmail(HttpServletRequest request){

        String email = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("email".equals(cookie.getName())) {
                    email = cookie.getValue();
                    break;
                }
            }
        }
        UserEntity user = userRepository.findByEmail(email);
        return user;
    }

    public void modifyUserInfo(ModifyUserDTO modifyUserDTO, HttpServletRequest request){
        UserEntity userEntity = findInfoByEmail(request);
        if (userEntity != null) {
            if (modifyUserDTO.getName() != null) {
                userEntity.setName(modifyUserDTO.getName());
            }
            if (modifyUserDTO.getEmail() != null) {
                userEntity.setEmail(modifyUserDTO.getEmail());
            }
            if (modifyUserDTO.getPassword() != null) {
                userEntity.setPassword(bCryptPasswordEncoder.encode(modifyUserDTO.getPassword()));
            }
            if (modifyUserDTO.getProfileUrl() != null) {
                userEntity.setProfileUrl(modifyUserDTO.getProfileUrl());
            }
            userRepository.save(userEntity);
        } else {
            throw new RuntimeException("User not found");
        }


    }

    public void deleteUserInfo(HttpServletRequest request){
        UserEntity userEntity= findInfoByEmail(request);
        if (userEntity != null) {
            userRepository.delete(userEntity); // 유저 정보를 삭제
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public void joinProcess(JoinUserDTO joinUserDTO) {
        System.out.println("joinProcess start");
        String email = joinUserDTO.getEmail();
        String password = joinUserDTO.getPassword();
        String name = joinUserDTO.getName();

        UserEntity isExist = userRepository.findByEmail(email);
        if (isExist != null) {
            return;
        }
        System.out.println("joinProcess start");
        UserEntity data = new UserEntity();
        data.setEmail(email);
        data.setPassword(bCryptPasswordEncoder.encode(password));
        data.setName(name);
        data.setRole("ROLE_USER");
        data.setSocialLogin("local");
        System.out.println("저장성공");
        userRepository.save(data);


    }
}
