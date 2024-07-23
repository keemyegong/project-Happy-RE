package com.example.happyre.service;

import com.example.happyre.dto.CustomUserDetails;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {

        this.userRepository = userRepository;
    }


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("CustomUserDetailsService email: " + email);
        // DB에서 조회
        UserEntity userData = userRepository.findByEmail(email);
        if (userData == null) {
            // 사용자 정보를 찾을 수 없을 때 예외를 던짐
            System.out.println();
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        // UserDetails에 담아서 return하면 AuthenticationManager가 검증함
        return new CustomUserDetails(userData);
    }
}
