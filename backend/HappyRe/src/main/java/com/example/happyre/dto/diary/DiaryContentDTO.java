package com.example.happyre.dto.diary;

import lombok.Data;

@Data
public class DiaryContentDTO {
    private String date;
    private String summary;
    private Double russellAvgX;
    private Double russellAvgY;
}
