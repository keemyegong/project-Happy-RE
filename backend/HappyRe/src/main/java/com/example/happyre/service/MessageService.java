package com.example.happyre.service;

import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.KeywordEntity;
import com.example.happyre.entity.MessageEntity;

import java.util.List;
import java.util.Optional;

public interface MessageService {
    MessageEntity insert(MessageEntity messageEntity);

    Optional<MessageEntity> findById(int messageId);

    List<MessageEntity> findByDiaryEntity(DiaryEntity diaryEntity);

    MessageEntity update(MessageEntity messageDTOEntity);

    void delete(MessageEntity messageDTOEntity);
}
