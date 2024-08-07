package com.example.happyre.service;

import com.example.happyre.entity.UserEntity;
import com.example.happyre.entity.UserMessageArchivedEntity;
import com.example.happyre.entity.UserMessageEntity;
import com.example.happyre.repository.UserMessageArchivedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class UserMessageArchivedServiceImpl implements UserMessageArchivedService{

    private final UserMessageArchivedRepository userMessageArchivedRepository;

    @Override
    public UserMessageArchivedEntity insert(UserMessageArchivedEntity userMessageArchivedEntity){
        return userMessageArchivedRepository.save(userMessageArchivedEntity);
    }

    @Override
    public List<UserMessageArchivedEntity> findByUserMessageEntityAndUserEntity(UserMessageEntity userMessageEntity, UserEntity userEntity){
        return userMessageArchivedRepository.findByUserMessageEntityAndUserEntity(userMessageEntity, userEntity);
    }

    @Override
    public void delete(UserMessageArchivedEntity userMessageArchivedEntity){
        userMessageArchivedRepository.delete(userMessageArchivedEntity);
    }
}
