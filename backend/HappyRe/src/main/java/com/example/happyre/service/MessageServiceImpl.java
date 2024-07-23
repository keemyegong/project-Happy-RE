package com.example.happyre.service;

import com.example.happyre.entity.MessageEntity;
import com.example.happyre.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class MessageServiceImpl implements MessageService{

    private final MessageRepository messageRepository;

    @Override
    public Optional<MessageEntity> findById(int id) {
        return messageRepository.findById(id);
    }

    @Override
    public List<MessageEntity> findAll() {
        return messageRepository.findAll();
    }

    @Override
    public MessageEntity insert(MessageEntity diaryEntity) {
        return messageRepository.save(diaryEntity);
    }

    @Override
    public MessageEntity update(MessageEntity messageDTOEntity) {
        MessageEntity matchingEntity = messageRepository.findById(messageDTOEntity.getMessageId()).get();
        matchingEntity.setSequence(messageDTOEntity.getSequence());
        matchingEntity.setContent(messageDTOEntity.getContent());
        matchingEntity.setAudioKey(messageDTOEntity.getAudioKey());
        return messageRepository.save(matchingEntity);
    }

    @Override
    public void delete(int id) {
        MessageEntity matchingEntity = messageRepository.findById(id).get();
        messageRepository.delete(matchingEntity);
    }

}
