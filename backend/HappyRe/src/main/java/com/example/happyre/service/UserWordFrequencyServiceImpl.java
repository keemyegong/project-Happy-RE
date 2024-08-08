package com.example.happyre.service;

import com.example.happyre.entity.UserEntity;
import com.example.happyre.entity.UserWordFrequencyEntity;
import com.example.happyre.repository.UserWordFrequencyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserWordFrequencyServiceImpl implements UserWordFrequencyService {

    private final UserWordFrequencyRepository userWordFrequencyRepository;

    @Override
    public void splitWord(ArrayList<String> sentence, int userid) {
        ArrayList<String> words = new ArrayList<>();
        sentence.forEach(s -> {
            String[] splitWords = s.split(" ");  // 띄어쓰기로 문자열 분리
            for (String word : splitWords) {
                System.out.println("++"+word+"++");
                // 특수문자 제거
                word = word.replaceAll("[^a-zA-Z0-9]", "");
                if (!word.isEmpty()) {
                    System.out.println("ADDDDDDDDD");
                    words.add(word);
                }
            }
        });
        for (String word : words) {
            System.out.println("***"+word+"***");
            userWordFrequencyRepository.upsertFrequency(userid, word, 1);
        }

    }

    @Override
    public List<UserWordFrequencyEntity> findUserWordFrequencyByUser(UserEntity userEntity) {
        System.out.println("********IN UserWordFrequencyServiceImpl findUserWordFrequencyByUser*******");
        List<UserWordFrequencyEntity> userWordFrequencyEntities = userWordFrequencyRepository.findByUserEntity(userEntity);
        System.out.println(userWordFrequencyEntities.toString());
        System.out.println("********IN UserWordFrequencyServiceImpl findUserWordFrequencyByUser*******");
        return  userWordFrequencyEntities;
    }


}
