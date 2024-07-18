package com.example.happyre.service;

import com.example.happyre.dto.JoinUserDTO;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.repository.UserRepository;
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
