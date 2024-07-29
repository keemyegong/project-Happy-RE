//TODO Request 중 일부만 사용중
package com.example.happyre.dto.diary;

import lombok.Data;

import java.util.List;

@Data
public class ReportResponse {
    private String summary;
    private List<Integer> diaryEmotions;
    private List<KeyWordResponse> keywords;
}
