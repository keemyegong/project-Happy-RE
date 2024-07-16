package com.ssafy.api.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;

import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;


import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.*;


@Service("oauthService")
public class OauthServiceImpl implements OauthService{

    @Value("${google.clientId}")
    private String clientId;

    @Value("${google.clientSecret}")
    private String clientSecret;

    private final GoogleIdTokenVerifier verifier;

    private RestTemplate restTemplate;

    public OauthServiceImpl() {
        verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new JacksonFactory())
                .setAudience(Arrays.asList(clientId))
                .build();

        restTemplate = new RestTemplate();
    }

    public GoogleIdToken.Payload verifyGoogle(String idTokenString) throws GeneralSecurityException, IOException {
//        샘플 스니펫
//        POST /token HTTP/1.1
//        Host: oauth2.googleapis.com
//        Content-Type: application/x-www-form-urlencoded
//
//        code=4/P7q7W91a-oMsCeLvIaQm6bTrgtp7&
//                client_id=your_client_id&
//                client_secret=your_client_secret&
//                redirect_uri=http://127.0.0.1:9004&
//                grant_type=authorization_code

        //Google Oauth token발행 주소를 설정
        String targetUrl = "https://oauth2.googleapis.com/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("code",  idTokenString);
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("redirect_uri", "http://localhost:8080/api/auth/google/token");
        body.add("grant_type", "authorization_code");

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<Map<String, String>> response = restTemplate.exchange(targetUrl, HttpMethod.POST, entity,new ParameterizedTypeReference<Map<String, String>>() {});




        return null;
    }

    public String verifyKakao(String accessCode) throws GeneralSecurityException, IOException {
        //AccessCode로 AccessToken 발급
        String targetUrl = "https://kauth.kakao.com/oauth/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);



        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", "b7b48dd2d7bd7d2a07f6c5f15d4883e2");
        body.add("redirect_uri", "http://localhost:8080/api/auth/kakao");
        body.add("code", accessCode);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<Map<String, String>> response = restTemplate.exchange(targetUrl, HttpMethod.POST, entity,new ParameterizedTypeReference<Map<String, String>>() {});

        System.out.println(response.getBody());
        return response.getBody().get("access_token");
    }

    public String getTokenKakao(String accessToken) throws GeneralSecurityException, IOException {
        //accessToken 으로 KAKAO 사용자 정보 발급
        String targetUrl = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Map<String, String>> response = restTemplate.exchange(targetUrl, HttpMethod.GET, entity, new ParameterizedTypeReference<Map<String, String>>() {});

        System.out.println(response.getBody());



        return "";
    }


}
