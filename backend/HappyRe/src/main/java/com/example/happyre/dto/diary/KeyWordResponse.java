package com.example.happyre.dto.diary;

import lombok.Data;

import java.util.List;

@Data
public class KeyWordResponse {
    private String keyword;
    private String summary;
    private double russellX;
    private double russellY;
    private List<Integer> keywordEmotions;
}
