package com.example.happyre.config;

import com.example.happyre.util.AttributeEncryptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class CryptoConfig {

    @Value("${spring.jwt.secret}")
    private String secretKey;

    @Bean
    public AttributeEncryptor attributeEncryptor() {
        AttributeEncryptor.setSecretKey(secretKey);
        return new AttributeEncryptor();
    }
}
