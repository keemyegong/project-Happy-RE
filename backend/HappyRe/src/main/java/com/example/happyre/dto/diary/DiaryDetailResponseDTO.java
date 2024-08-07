package com.example.happyre.dto.diary;

import com.example.happyre.entity.KeywordEntity;
import com.example.happyre.entity.MessageEntity;
import lombok.Data;

import java.util.List;
@Data
public class DiaryDetailResponseDTO {
    private List<MessageEntity> messageEntities;
    private List<KeywordEntity> keywordEntities;
    public DiaryDetailResponseDTO(List<MessageEntity> messageEntities, List<KeywordEntity> keywordEntities) {
        this.messageEntities = messageEntities;
        this.keywordEntities = keywordEntities;
    }
}
