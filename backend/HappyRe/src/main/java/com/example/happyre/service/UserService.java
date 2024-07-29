package com.example.happyre.service;

import com.example.happyre.dto.user.JoinUserDTO;
import com.example.happyre.dto.user.ModifyUserDTO;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.jwt.JWTUtil;
import com.example.happyre.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Data
@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JWTUtil jwtUtil;

    //TODO: 유저를 찾을 수 없는 경우의 예외 처리
    public UserEntity findByRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        UserEntity user = userRepository.findByEmail(jwtUtil.getEmail(token));
        return user;
    }

    public void fistRussell(HttpServletRequest request, Map<String, Double> body) {
        UserEntity user = findByRequest(request);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        user.setRussellX(body.get("x"));
        user.setRussellY(body.get("y"));
        userRepository.save(user);

    }


    public void modifyUserInfo(ModifyUserDTO modifyUserDTO, HttpServletRequest request) {
        UserEntity userEntity = findByRequest(request);
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

    public void deleteUserInfo(HttpServletRequest request) {
        UserEntity userEntity = findByRequest(request);
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
            throw new IllegalStateException("User with email " + email + " already exists");
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
