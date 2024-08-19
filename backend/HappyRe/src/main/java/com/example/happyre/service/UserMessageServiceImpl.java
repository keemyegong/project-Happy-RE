package com.example.happyre.service;

import com.example.happyre.dto.usermessage.UserMessageDTO;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.entity.UserMessageAttachedKeywordEntity;
import com.example.happyre.entity.UserMessageEntity;
import com.example.happyre.repository.UserMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserMessageServiceImpl implements UserMessageService {

    private final UserMessageRepository userMessageRepository;

    private final KeywordService keywordService;

    @Override
    public UserMessageEntity insertDTO(UserMessageDTO userMessageDTO, UserEntity userEntity) {
        UserMessageEntity toInsert = new UserMessageEntity();
        toInsert.setUserEntity(userEntity);
        toInsert.setContent(userMessageDTO.getContent());
        toInsert.setDate(Timestamp.valueOf(LocalDateTime.now()));
        toInsert.setUserMessageAttachedKeywordEntityList(
                userMessageDTO.getKeywordEntityDTOList().stream().map(dto -> {
                    UserMessageAttachedKeywordEntity msgkwd = new UserMessageAttachedKeywordEntity();
                    msgkwd.setUserMessageEntity(toInsert);
                    msgkwd.setKeywordEntity(
                            keywordService.findById(dto.getKeywordId()).orElseThrow(() -> new RuntimeException("KeywordEntityDTO 에 해당되는 KeywordEntity를 찾을 수 없음. KeywordEntityDTO: " + dto.toString()))
                    );
                    return msgkwd;
                }).toList()
        );
        toInsert.setUserMessageArchivedEntityList(new ArrayList<>());
        return userMessageRepository.save(toInsert);
    }

    @Override
    public Optional<UserMessageEntity> findById(Integer id) {
        return userMessageRepository.findById(id);
    }

    @Override
    public List<UserMessageEntity> findByUserEntityAndDate(UserEntity userEntity, Date date){
        return userMessageRepository.findByUserEntityAndDate(userEntity, date);
    }

    @Override
    public List<UserMessageEntity> findArchivedByUserEntity(UserEntity userEntity) {
        return userMessageRepository.findArchivedByUserEntity(userEntity);
    }

    @Override
    public List<UserMessageEntity> sample(Integer size, UserEntity userEntity) {
        return userMessageRepository.findRandomEntities(size, userEntity.getId());
    }
}
