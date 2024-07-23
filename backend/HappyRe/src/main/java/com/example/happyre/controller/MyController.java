package com.example.happyre.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Tag(name = "Not yet Implemented")
@Controller
@ResponseBody
public class MyController {

    @GetMapping("/my")
    public String myAPI() {
        return "my API";
    }
}
