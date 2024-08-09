package com.example.happyre.service;

import com.example.happyre.dto.oauth.*;
import com.example.happyre.dto.user.UserDTO;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        System.out.println(oAuth2User);
//        properties={nickname=이창현,
//                profile_image=http://t1.kakaocdn.net/account_images/default_profile.jpeg.twg.thumb.R640x640,
//                 thumbnail_image=http://t1.kakaocdn.net/account_images/default_profile.jpeg.twg.thumb.R110x110},
//                kakao_account={profile_nickname_needs_agreement=false,
//                                profile_image_needs_agreement=false,
//                                profile={nickname=이창현,
//                                        thumbnail_image_url=http://t1.kakaocdn.net/account_images/default_profile.jpeg.twg.thumb.R110x110,
//                                        profile_image_url=http://t1.kakaocdn.net/account_images/default_profile.jpeg.twg.thumb.R640x640,
//                                        is_default_image=true, is_default_nickname=false},
//                                has_email=true,
//                                email_needs_agreement=false,
//                                is_email_valid=true,
//                                is_email_verified=true,
//                                email=ckd5508@naver.com}
//        }
//
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
        }else{
            return null;
        }

        String username = oAuth2Response.getProvider() + " " + oAuth2Response.getProviderId();
        String email = oAuth2Response.getEmail();

        //유저 이름을 통해서 검색함
        UserEntity existData = userRepository.findByEmail(email);
        if (existData == null) {
            UserEntity userEntity = new UserEntity();
            userEntity.setEmail(oAuth2Response.getEmail());
            userEntity.setName(oAuth2Response.getName());
            userEntity.setPassword(null);
            userEntity.setRole("ROLE_USER");
            userEntity.setSocialLogin(oAuth2Response.getProvider());
            userRepository.save(userEntity);

            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(username);
            userDTO.setEmail(email);
            userDTO.setName(oAuth2Response.getName());
            userEntity.setRole("ROLE_USER");

            return new CustomOAuth2User(userDTO);
        } else {
            existData.setEmail(oAuth2Response.getEmail());
            existData.setName(oAuth2Response.getName());

            userRepository.save(existData);

            UserDTO userDTO = new UserDTO();
            userDTO.setEmail(existData.getEmail());
            userDTO.setName(oAuth2Response.getName());
            userDTO.setRole(existData.getRole());

            return new CustomOAuth2User(userDTO);

        }

    }
}
