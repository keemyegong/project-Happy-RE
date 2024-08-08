package com.example.happyre.dto.diary;

import com.example.happyre.entity.EmotionEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class KeywordWithEmotionDTO {

    private Integer keywordId;

    private Integer diaryId;

    private Integer sequence;

    private String keyword;

    private String summary;

    private Double russellX;

    private Double russellY;

    private Boolean archived;

    @JsonProperty("emotions")
    private List<EmotionEntity> emotions;
}
