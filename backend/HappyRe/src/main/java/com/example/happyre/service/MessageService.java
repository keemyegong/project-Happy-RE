package com.example.happyre.service;

import com.example.happyre.dto.message.MessageEntityDTO;
import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.MessageEntity;
import com.example.happyre.entity.UserEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface MessageService {
    MessageEntity insert(MessageEntity messageEntity);

    MessageEntity insertDTO(MessageEntityDTO messageEntityDTO) throws Exception;

    List<MessageEntity> insertDTOList(List<MessageEntityDTO> messageEntityDTOList);

    Optional<MessageEntity> findById(int messageId);

    List<MessageEntity> findByDiaryEntity(DiaryEntity diaryEntity);

    List<MessageEntity> findByDiaryId(Integer diaryId);

    List<MessageEntity> findByArchivedAndUserEntity(Boolean isArchived, UserEntity userEntity);

    MessageEntity updateDTO(MessageEntityDTO messageEntityDTO);

    void updateArchive(int messageId, boolean archive);

    void delete(MessageEntity messageDTOEntity);

    void deleteDTO(MessageEntityDTO messageEntityDTO);

    ArrayList<MessageEntity> insertMessageDTOList(DiaryEntity diaryEntity, List<MessageEntityDTO> messageEntityDTOList);
}
