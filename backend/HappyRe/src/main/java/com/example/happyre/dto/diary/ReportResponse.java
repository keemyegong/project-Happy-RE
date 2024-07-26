package com.example.happyre.dto.diary;

import lombok.Data;

import java.util.List;

@Data
public class ReportResponse {
    private String summary;
    private List<Integer> diary_emotions;
    private List<KeyWordResponse> keywords;
}
