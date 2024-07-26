package com.example.happyre.service;

import com.example.happyre.dto.user.JoinUserDTO;
import com.example.happyre.dto.user.ModifyUserDTO;
import com.example.happyre.dto.user.UserWithProfile;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.jwt.JWTUtil;
import com.example.happyre.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.http.HttpHeaders;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@Service
public class UserService {
    @Value("${file.upload-dir}")
    private String uploadDir;

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JWTUtil jwtUtil;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, JWTUtil jwtUtil) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.jwtUtil = jwtUtil;
    }



    public UserEntity findInfoByEmail(HttpServletRequest request){

        String email = null;
//        Cookie[] cookies = request.getCookies();
//
//        if (cookies != null) {
//            for (Cookie cookie : cookies) {
//
//                if ("Authorization".equals(cookie.getName())) {
//                    String token = cookie.getValue();
//
//                    email = jwtUtil.getEmail(token);
//                    break;
//                }
//            }
//        }
        String token = request.getHeader("Authorization").substring(7);
        email = jwtUtil.getEmail(token);
        UserEntity user = userRepository.findByEmail(email);
        return user;
    }

    public Resource myProfile(HttpServletRequest req) throws Exception {
        UserEntity userEntity;
        FileInputStream fileInputStream = null;

        try {
            userEntity = findInfoByEmail(req);
            String path = userEntity.getProfileUrl();
            if(path == null || path.isEmpty()){
                path = "/var/profileimg/0.jpg";
            }
            System.out.println("myProfile Service path:"+ path);
            FileSystemResource resource = new FileSystemResource(path);
            if (!resource.exists()) {
                throw new IOException("File not found: " + path);
            }

            return resource;
        } catch (Exception e) {
            throw new IOException("File not found: " );
        }



    }

    public void fistRussell(HttpServletRequest request, Map<String,Double> body) {
        UserEntity user = findInfoByEmail(request);
        if(user == null) {
            throw new RuntimeException("User not found");
        }
        user.setRussellX(body.get("x"));
        user.setRussellY(body.get("y"));
        userRepository.save(user);

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



    public void uploadProfile(HttpServletRequest req, MultipartFile file) {
        UserEntity userEntity = findInfoByEmail(req);
        if (userEntity == null) throw new RuntimeException("User not found");
        int userId  = userEntity.getId();

        // 파일명 설정: userId + 원래 파일 확장자
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.isEmpty()) {
            throw new RuntimeException("Invalid file");
        }

        // 파일 확장자 추출
        String fileExtension = getFileExtension(originalFileName);
        if (fileExtension == null || fileExtension.isEmpty()) {
            throw new RuntimeException("File must have an extension");
        }

        // 최종 파일명 설정
        String fileName = userId + "." + fileExtension;

        Path filePath = Paths.get(uploadDir).resolve(fileName);

        try {
            // 디렉토리가 존재하지 않으면 생성
            Files.createDirectories(filePath.getParent());

            // 파일 저장 (기존 파일이 있는 경우 덮어쓰기)
            Files.copy(file.getInputStream(), filePath);
            userEntity.setProfileUrl(filePath.toAbsolutePath().toString());
            userRepository.save(userEntity);
            System.out.println("File uploaded successfully: " + filePath.toString());
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }



    }

    private String getFileExtension(String fileName) {
        int lastIndexOfDot = fileName.lastIndexOf('.');
        if (lastIndexOfDot == -1) {
            return ""; // 확장자가 없는 경우 빈 문자열 반환
        }
        return fileName.substring(lastIndexOfDot + 1);
    }
}
