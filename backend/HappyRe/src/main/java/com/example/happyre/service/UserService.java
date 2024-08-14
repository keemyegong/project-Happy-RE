package com.example.happyre.service;

import com.example.happyre.dto.user.JoinUserDTO;
import com.example.happyre.dto.user.ModifyUserDTO;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.jwt.JWTUtil;
import com.example.happyre.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Data
@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JWTUtil jwtUtil;
    @Value("${file.upload-dir}")
    private String uploadDir;

    //TODO: 유저를 찾을 수 없는 경우의 예외 처리
    public UserEntity findByRequest(HttpServletRequest request) {

        System.out.println(request.toString());
        System.out.println(request);
        String token = request.getHeader("Authorization").substring(7);
        UserEntity user = userRepository.findByEmail(jwtUtil.getEmail(token));
        return user;
    }

    public Optional<UserEntity> findById(Integer id) {
        return userRepository.findById(id);
    }

    public Resource myProfile(HttpServletRequest req) throws Exception {
        UserEntity userEntity;
        FileInputStream fileInputStream = null;

        try {
            userEntity = findByRequest(req);
            String path = userEntity.getProfileUrl();
            if (path == null || path.isEmpty()) {
                path = "/var/profileimg/0.jpg";
            }
            System.out.println("myProfile Service path:" + path);
            FileSystemResource resource = new FileSystemResource(path);
            if (!resource.exists()) {
                throw new IOException("File not found: " + path);
            }

            return resource;
        } catch (Exception e) {
            throw new IOException("File not found: ");
        }


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
            if (modifyUserDTO.getMyfrog() != null) {
                userEntity.setMyfrog(modifyUserDTO.getMyfrog());
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

    public void joinProcess(JoinUserDTO joinUserDTO) throws Exception {
        System.out.println("joinProcess start");
        String email = joinUserDTO.getEmail();
        String password = joinUserDTO.getPassword();
        String name = joinUserDTO.getName();

        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(email);

        if (!matcher.matches()) {
            throw new RuntimeException("Invalid email");
        }

        UserEntity isExist = userRepository.findByEmail(email);
        if (isExist != null) {
            throw new IllegalAccessException("User email aleady exist");
        }
        try {
            System.out.println("joinProcess start");
            UserEntity data = new UserEntity();
            data.setEmail(email);
            data.setPassword(bCryptPasswordEncoder.encode(password));
            data.setName(name);
            data.setRole("ROLE_USER");
            data.setSocialLogin("local");
            System.out.println("저장성공");
            userRepository.save(data);
        } catch (Exception e) {
            throw new IOException("User creation failed");
        }

    }


    public void uploadProfile(HttpServletRequest req, MultipartFile file) {
        UserEntity userEntity = findByRequest(req);
        if (userEntity == null) throw new RuntimeException("User not found");
        int userId = userEntity.getId();

        // 파일명 설정: userId + 원래 파일 확장자
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.isEmpty()) {
            throw new RuntimeException("Invalid file");
        }

        // 파일 확장자 추출
        String fileExtension = getFileExtension(originalFileName).toLowerCase();
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
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 파일 경로를 절대 경로로 설정
            userEntity.setProfileUrl(filePath.toAbsolutePath().toString());
            userRepository.save(userEntity);

            System.out.println("File uploaded successfully: " + filePath.toString());
        } catch (IOException e) {
            System.out.println("File uploaded failed: " + e.getMessage());
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
