package com.example.happyre.service;

import com.example.happyre.entity.UserEntity;
import com.example.happyre.entity.UserWordFrequencyEntity;
import com.example.happyre.repository.UserWordFrequencyRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserWordFrequencyServiceImpl implements UserWordFrequencyService {

    private UserWordFrequencyRepository userWordFrequencyRepository;

    @Override
    public void splitWord(ArrayList<String> sentence, int userid) {
        ArrayList<String> words = new ArrayList<>();
        sentence.forEach(s -> {
            String[] splitWords = s.split("\\s+");  // 띄어쓰기로 문자열 분리
            for (String word : splitWords) {
                // 특수문자 제거
                word = word.replaceAll("[^a-zA-Z0-9]", "");
                if (!word.isEmpty()) {
                    words.add(word);
                }
            }
        });
        for (String word : words) {
            userWordFrequencyRepository.upsertFrequency(userid, word, 1);
        }

    }

    @Override
    public List<UserWordFrequencyEntity> findUserWordFrequencyByUser(UserEntity userEntity) {
        return  userWordFrequencyRepository.findByUserEntity(userEntity);
    }


}
