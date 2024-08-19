package com.example.happyre.service;

import com.example.happyre.dto.usermessage.UserMessageDTO;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.entity.UserMessageEntity;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

public interface UserMessageService {

    UserMessageEntity insertDTO(UserMessageDTO userMessageDTO, UserEntity userEntity);

    Optional<UserMessageEntity> findById(Integer id);

    List<UserMessageEntity> findByUserEntityAndDate(UserEntity userEntity, Date date);

    List<UserMessageEntity> findArchivedByUserEntity(UserEntity userEntity);

    //특정 유저가 생성하지 않은 UserMessage 랜덤으로 size 개 추출
    List<UserMessageEntity> sample(Integer size, UserEntity userEntity);
}
