package com.example.happyre.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {

    private String role;
    private String name;
    @Deprecated
    private String username;
    private String email;
}
