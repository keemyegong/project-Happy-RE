package com.example.happyre.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class ModifyUserDTO {
    private String email;
    private String password;
    private String name;
    private String profileUrl;
}
