package com.example.happyre.dto.archived;

import com.example.happyre.entity.KeywordEntity;
import com.example.happyre.entity.MessageEntity;
import com.example.happyre.entity.UserMessageEntity;
import lombok.Data;

import java.util.List;

@Data
public class ArchivedResponseDTO {
    private List<KeywordEntity> keywordEntityList;
    private List<MessageEntity> messageEntityList;
    private List<UserMessageEntity> userMessageEntityList;
}
