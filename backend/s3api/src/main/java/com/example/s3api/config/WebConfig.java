package com.example.s3api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000") // React 앱의 URL을 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE") // 필요한 HTTP 메서드를 허용
                .allowedHeaders("*"); // 모든 헤더를 허용
    }
}
