package com.example.happyre.dto.user;

import com.example.happyre.entity.UserEntity;
import lombok.Data;

import java.io.FileInputStream;

@Data
public class UserWithProfile {
    UserEntity userEntity;
    FileInputStream fileInputStream;
}
