package com.example.happyre.dto.message;

import com.example.happyre.entity.MessageEntity;
import lombok.Data;

@Data
public class MessageEntityDTO {
    private Integer messageId;
    private Integer diaryId;
    private Integer sequence;
    private String content;
    private MessageEntity.Speaker speaker;
    private String audioKey;
    private String summary;
    private Integer russellX;
    private Integer russellY;
}
