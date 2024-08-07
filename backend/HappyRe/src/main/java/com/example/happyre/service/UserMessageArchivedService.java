package com.example.happyre.service;

import com.example.happyre.entity.UserEntity;
import com.example.happyre.entity.UserMessageArchivedEntity;
import com.example.happyre.entity.UserMessageEntity;

import java.util.List;

public interface UserMessageArchivedService {
    UserMessageArchivedEntity insert(UserMessageArchivedEntity userMessageArchivedEntity);

    List<UserMessageArchivedEntity> findByUserMessageEntityAndUserEntity(UserMessageEntity userMessageEntity, UserEntity userEntity);

    void delete(UserMessageArchivedEntity userMessageArchivedEntity);
}
