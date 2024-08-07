package com.example.happyre.service;

import com.example.happyre.dto.usermessage.UserMessageDTO;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.entity.UserMessageEntity;

import java.util.List;
import java.util.Optional;

public interface UserMessageService {

    UserMessageEntity insertDTO(UserMessageDTO userMessageDTO, UserEntity userEntity);

    Optional<UserMessageEntity> findById(Integer id);

    List<UserMessageEntity> findArchivedByUserEntity(UserEntity userEntity);

    List<UserMessageEntity> sample(Integer size);
}
