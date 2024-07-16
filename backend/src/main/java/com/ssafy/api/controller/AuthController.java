package com.ssafy.api.controller;
import java.util.*;

import com.ssafy.api.service.OauthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.ssafy.api.request.UserLoginPostReq;
import com.ssafy.api.response.UserLoginPostRes;
import com.ssafy.api.service.UserService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.common.util.JwtTokenUtil;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.UserRepositorySupport;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.ApiResponse;

//google Oauth 토큰인증
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

import java.io.IOException;
import java.security.GeneralSecurityException;

/**
 * 인증 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "인증 API", tags = {"Auth."})
@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	UserService userService;
	
	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	private OauthService oauthService;

	
	@PostMapping("/login")
	@ApiOperation(value = "로그인", notes = "<strong>아이디와 패스워드</strong>를 통해 로그인 한다.") 
    @ApiResponses({
        @ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
        @ApiResponse(code = 401, message = "인증 실패", response = BaseResponseBody.class),
        @ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
        @ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
    })
	public ResponseEntity<UserLoginPostRes> login(@RequestBody @ApiParam(value="로그인 정보", required = true) UserLoginPostReq loginInfo) {
		String userId = loginInfo.getId();
		String password = loginInfo.getPassword();
		
		User user = userService.getUserByUserId(userId);
		// 로그인 요청한 유저로부터 입력된 패스워드 와 디비에 저장된 유저의 암호화된 패스워드가 같은지 확인.(유효한 패스워드인지 여부 확인)
		if(passwordEncoder.matches(password, user.getPassword())) {
			// 유효한 패스워드가 맞는 경우, 로그인 성공으로 응답.(액세스 토큰을 포함하여 응답값 전달)
			return ResponseEntity.ok(UserLoginPostRes.of(200, "Success", JwtTokenUtil.getToken(userId)));
		}
		// 유효하지 않는 패스워드인 경우, 로그인 실패로 응답.
		return ResponseEntity.status(401).body(UserLoginPostRes.of(401, "Invalid Password", null));
	}

	@PostMapping("/google")
	public ResponseEntity<?> authenticateGoogleUser(@RequestBody Map<String,String> credential ) throws GeneralSecurityException, IOException, GeneralSecurityException {
		System.out.println(credential.get("token"));
		GoogleIdToken.Payload payload = oauthService.verifyGoogle(credential.get("token"));
		System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1");

		if (payload == null) {
			return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Invalid Google Token"));
		}
		System.out.println("22222222222222222222222");
		System.out.println(payload.getSubject());
		String userId = payload.getSubject();

		System.out.println(userId);
		//DB에 회원가입 되어있는 유저인지 확인
		User user = userService.getUserByUserId(userId);
		//기존회원이 아니면 회원가입
		if (user == null) {


		}

		//생성된 정보로 토큰생성 후 발급
		String jwt = JwtTokenUtil.getToken(userId);
		return ResponseEntity.ok(jwt);
	}


	@PostMapping("/google/token")
	public ResponseEntity<?> getTokenGoogleUser(@RequestBody Map<String,String> credential ) throws GeneralSecurityException, IOException, GeneralSecurityException {
		System.out.println("!!!!!!! getTokenGoogleUser !!!!!!");
		System.out.println(credential);

		return null;
	}


	@GetMapping("/kakao")
	public String authenticateKakao(@RequestParam Map<String,String> params ) throws GeneralSecurityException, IOException, GeneralSecurityException {
		System.out.println("Do KAKAO LOGIN");
		System.out.println(params);
		String accessToken = oauthService.verifyKakao(params.get("code"));
		System.out.println(oauthService.getTokenKakao(accessToken));
		return null;

	}


}
