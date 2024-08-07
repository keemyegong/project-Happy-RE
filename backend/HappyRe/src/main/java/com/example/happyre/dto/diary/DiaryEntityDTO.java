package com.example.happyre.dto.diary;

import lombok.Data;

@Data
public class DiaryEntityDTO {
    private Integer diaryId;
    private Integer userId;
    private String date;
    private String summary;
}
