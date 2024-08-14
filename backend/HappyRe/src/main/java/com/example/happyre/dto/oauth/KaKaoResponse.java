package com.example.happyre.dto.oauth;

import java.util.Map;

public class KaKaoResponse implements OAuth2Response {
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
//public KaKaoResponse(Map<String, Object> attribute) {
//    this.attribute = (Map<String, Object>) attribute.get("propertyes");
//}
// 카카오 API 응답에서 전달된 사용자 정보가 담긴 맵
    private final Map<String, Object> attributes;

    // 생성자
    public KaKaoResponse(Map<String, Object> attributes) {
        // "properties"와 "kakao_account"의 내용을 함께 담습니다.
        this.attributes = attributes;
    }

    @Override
    public String getProvider() {
        // OAuth2 제공자 이름을 반환합니다. 예: "kakao"
        return "kakao";
    }

    @Override
    public String getProviderId() {
        // 사용자 ID를 가져오기 위해 "id" 키를 사용합니다.
        return attributes.get("id").toString();
    }

    @Override
    public String getEmail() {
        // 이메일을 가져옵니다.
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        return kakaoAccount != null ? (String) kakaoAccount.get("email") : null;
    }

    @Override
    public String getName() {
        // 사용자 이름(닉네임)을 가져옵니다.
        Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
        return properties != null ? (String) properties.get("nickname") : null;
    }
}
