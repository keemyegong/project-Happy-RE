package com.example.happyre.jwt;

import com.example.happyre.dto.oauth.CustomOAuth2User;
import com.example.happyre.dto.user.UserDTO;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class JWTFilter extends OncePerRequestFilter {
    private final JWTUtil jwtUtil;
    private final List<String> skipUrls = List.of("/oauth2", "/login/oauth2/code", "login");

    public JWTFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //cookie들을 불러온 뒤 Authorization Key에 담긴 쿠키를 찾음
        String authorization = null;
        Cookie[] cookies = request.getCookies();
        System.out.println("JWTFilter!!!!!!!!!!11");
        System.out.println("JWTFilter!!!!!!!!!!11");
        System.out.println("JWTFilter!!!!!!!!!!11");

        String path = request.getRequestURI();
        if (path.equals("/api/user/login") || path.equals("/api/user/join") || path.equals("/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        if (skipUrls.stream().anyMatch(path::startsWith)) {
            filterChain.doFilter(request, response);
            return;
        }
        System.out.println(path);
        authorization = request.getHeader("Authorization");
        System.out.println("Header: tokennnnnn :" + authorization);
        boolean flag = true;

        if (cookies != null && authorization == null) {

            for (Cookie cookie : cookies) {

                System.out.println(cookie.getName());
                if (cookie.getName().equals("Authorization")) {
                    flag = false;
                    authorization = cookie.getValue();
                }
            }
        }


        //Authorization 헤더 검증
        if (authorization == null) {
            System.out.println("토큰없음");
            filterChain.doFilter(request, response);
            //response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization header is missing.");
            //return;


            //조건이 해당되면 메소드 종료 (필수)

        }

        //토큰
//        String token = authorization;
        String token;
        if (flag) {
            token = authorization.substring(7);
        } else {
            token = authorization;
        }
        System.out.println("Now Token : " + token);
        //토큰 소멸 시간 검증
        if (jwtUtil.isExpired(token)) {

            System.out.println("토큰만료");
            filterChain.doFilter(request, response);
            //response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token has expired.");
            return;
        }

        //토큰에서 username과 role 획득
        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);
        System.out.println("Now Token username : " + username + " role: " + role);

        //userDTO를 생성하여 값 set
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(username);
        userDTO.setRole(role);

        //UserDetails에 회원 정보 객체 담기
        CustomOAuth2User customOAuth2User = new CustomOAuth2User(userDTO);

        //스프링 시큐리티 인증 토큰 생성
        Authentication authToken = new UsernamePasswordAuthenticationToken(customOAuth2User, null, customOAuth2User.getAuthorities());
        //세션에 사용자 등록
        SecurityContextHolder.getContext().setAuthentication(authToken);
        System.out.println("dofillter");
        filterChain.doFilter(request, response);


    }
}
