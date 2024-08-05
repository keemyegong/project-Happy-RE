package com.example.happyre.dto.keyword;

import lombok.Data;

@Data
public class KeywordEntityDTO {

    private Integer keywordId;

    private Integer diaryId;

    private Integer sequence;

    private String keyword;

    private String summary;

    private Double russellX;

    private Double russellY;
}
