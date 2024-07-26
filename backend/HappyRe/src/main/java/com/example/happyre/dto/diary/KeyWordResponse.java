package com.example.happyre.dto.diary;

import lombok.Data;

import java.util.List;

@Data
public class KeyWordResponse {
    private String keyword;
    private String summary;
    private double russellx;
    private double russelly;
    private List<Integer> keyword_emotions;
}
