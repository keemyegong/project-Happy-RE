package com.example.happyre.service;

import com.example.happyre.dto.oauth.*;
import com.example.happyre.dto.user.UserDTO;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        System.out.println(oAuth2User);
        System.out.println("Loaded User from Userinfo Endpoint: " + oAuth2User.toString());
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Response oAuth2Response = null;
        if (registrationId.equals("naver")) {
            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        } else if (registrationId.equals("google")) {
            System.out.println(oAuth2User.getAttributes());
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        } else if (registrationId.equals("kakao")) {
            System.out.println(oAuth2User.getAttributes());
            oAuth2Response = new KaKaoResponse(oAuth2User.getAttributes());
        } else {
            return null;
        }

        String username = oAuth2Response.getProvider() + " " + oAuth2Response.getProviderId();
        String email = oAuth2Response.getEmail();

        //유저 이름을 통해서 검색함
        UserEntity existingUser = userRepository.findByEmail(email);
        if (existingUser == null) {
            UserEntity userEntity = new UserEntity();
            userEntity.setEmail(oAuth2Response.getEmail());
            userEntity.setName(oAuth2Response.getName());
            userEntity.setPassword(null);
            userEntity.setRole("ROLE_USER");
            userEntity.setSocialLogin(oAuth2Response.getProvider());
            existingUser = userEntity;
        } else {
            existingUser.setEmail(oAuth2Response.getEmail());
            existingUser.setName(oAuth2Response.getName());
        }

        UserEntity savedEntity = userRepository.save(existingUser);

        UserDTO userDTO = new UserDTO();
        userDTO.setEmail(savedEntity.getEmail());
        userDTO.setName(savedEntity.getName());
        userDTO.setRole(savedEntity.getRole());

        return new CustomOAuth2User(userDTO);
    }
}
