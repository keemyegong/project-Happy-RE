package com.example.happyre.service;

import com.example.happyre.entity.MessageEntity;

import java.util.List;
import java.util.Optional;

public interface MessageService {

    //### Spring Data JPA Repository 에서 기본으로 만들어주는 Method들의 Wrapper
    Optional<MessageEntity> findById(int id);

    List<MessageEntity> findAll();

    MessageEntity insert(MessageEntity diaryEntity);

    MessageEntity update(MessageEntity diaryDTOEntity);

    void delete(int id);

}
