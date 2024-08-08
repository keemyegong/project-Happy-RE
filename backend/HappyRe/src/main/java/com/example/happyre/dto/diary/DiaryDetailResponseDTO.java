package com.example.happyre.dto.diary;

import com.example.happyre.dto.keyword.KeywordEntityDTO;
import com.example.happyre.dto.message.MessageEntityDTO;
import com.example.happyre.entity.KeywordEntity;
import com.example.happyre.entity.MessageEntity;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class DiaryDetailResponseDTO {
    private List<MessageEntityDTO> messageEntities;
    private List<KeywordWithEmotionDTO> keywordEntities;

    public DiaryDetailResponseDTO(List<MessageEntity> messageEntities, List<KeywordEntity> keywordEntities) {
        this.messageEntities = new ArrayList<>();
        for (MessageEntity messageEntity : messageEntities) {
            MessageEntityDTO messageEntityDTO = new MessageEntityDTO();

            messageEntityDTO.setMessageId(messageEntity.getMessageId());
            messageEntityDTO.setDiaryId(messageEntity.getDiaryEntity().getDiaryId());
            messageEntityDTO.setSequence(messageEntity.getSequence());
            messageEntityDTO.setContent(messageEntity.getContent());
            messageEntityDTO.setSpeaker(messageEntity.getSpeaker());
            messageEntityDTO.setSummary(messageEntity.getSummary());
            messageEntityDTO.setRussellX(messageEntity.getRussellX());
            messageEntityDTO.setRussellY(messageEntity.getRussellY());
            messageEntityDTO.setArchived(messageEntity.getArchived());
            messageEntityDTO.setAudioKey(messageEntity.getAudioKey());

            this.messageEntities.add(messageEntityDTO);
        }
        this.keywordEntities = new ArrayList<>();
        for (KeywordEntity keywordEntity : keywordEntities) {
            KeywordWithEmotionDTO keywordEntityDTO = new KeywordWithEmotionDTO();

            keywordEntityDTO.setKeywordId(keywordEntity.getKeywordId());
            keywordEntityDTO.setDiaryId(keywordEntity.getDiaryEntity().getDiaryId());
            keywordEntityDTO.setSequence(keywordEntity.getSequence());
            keywordEntityDTO.setKeyword(keywordEntity.getKeyword());
            keywordEntityDTO.setSummary(keywordEntity.getSummary());
            keywordEntityDTO.setRussellX(keywordEntity.getRussellX());
            keywordEntityDTO.setRussellY(keywordEntity.getRussellY());
            keywordEntityDTO.setArchived(keywordEntity.getArchived());

            this.keywordEntities.add(keywordEntityDTO);
        }
    }
}
