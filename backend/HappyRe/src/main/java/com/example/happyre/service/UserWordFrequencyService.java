package com.example.happyre.service;

import com.example.happyre.entity.UserEntity;
import com.example.happyre.entity.UserWordFrequencyEntity;

import java.util.ArrayList;
import java.util.List;

public interface UserWordFrequencyService {
    void splitWord(ArrayList<String> words,int userid);

    List<UserWordFrequencyEntity> findUserWordFrequencyByUser(UserEntity userEntity);
}
