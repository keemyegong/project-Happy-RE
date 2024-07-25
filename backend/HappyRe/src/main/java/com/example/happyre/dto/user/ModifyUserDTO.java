package com.example.happyre.dto.user;

import lombok.Data;

@Data
public class ModifyUserDTO {
    private String email;
    private String password;
    private String name;
    private String profileUrl;
}
