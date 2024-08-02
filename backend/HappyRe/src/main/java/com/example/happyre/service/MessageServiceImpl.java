package com.example.happyre.service;

import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.MessageEntity;
import com.example.happyre.repository.MessageRepository;
import io.jsonwebtoken.lang.Assert;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;

    @Override
    public Optional<MessageEntity> findById(int id) {
        return messageRepository.findById(id);
    }

    @Override
    public List<MessageEntity> findByDiaryEntity(DiaryEntity diaryEntity) {
        return messageRepository.findByDiaryEntity(diaryEntity);
    }

    @Override
    public MessageEntity insert(MessageEntity messageEntity) {
        Assert.notNull(messageEntity.getDiaryEntity(), "diaryEntity.diaryEntity must not be null");
        return messageRepository.save(messageEntity);
    }

    @Override
    public MessageEntity update(MessageEntity messageDTOEntity) {
        //사전에 Check 되었다고 가정
        MessageEntity matchingEntity = messageRepository.findById(messageDTOEntity.getMessageId()).get();
        matchingEntity.setSequence(messageDTOEntity.getSequence());
        matchingEntity.setContent(messageDTOEntity.getContent());
        matchingEntity.setAudioKey(messageDTOEntity.getAudioKey());
        return messageRepository.save(matchingEntity);
    }

    @Override
    public void delete(MessageEntity messageDTOEntity) {
        //사전에 Check 되었다고 가정
        MessageEntity matchingEntity = messageRepository.findById(messageDTOEntity.getMessageId()).get();
        messageRepository.delete(matchingEntity);
    }

}
