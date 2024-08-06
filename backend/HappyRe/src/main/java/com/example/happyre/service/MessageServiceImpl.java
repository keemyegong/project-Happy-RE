package com.example.happyre.service;

import com.example.happyre.dto.message.MessageEntityDTO;
import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.MessageEntity;
import com.example.happyre.repository.MessageRepository;
import io.jsonwebtoken.lang.Assert;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
@RequiredArgsConstructor
@Service
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final DiaryService diaryService;

    private static MessageEntity getMessageEntity(MessageEntityDTO messageEntityDTO, DiaryEntity diaryEntity) {
        MessageEntity newOne = new MessageEntity();
        newOne.setDiaryEntity(diaryEntity);
        newOne.setSequence(messageEntityDTO.getSequence());
        newOne.setContent(messageEntityDTO.getContent());
        newOne.setSpeaker(messageEntityDTO.getSpeaker());
        newOne.setAudioKey(messageEntityDTO.getAudioKey());
        newOne.setSummary(messageEntityDTO.getSummary());
        newOne.setRussellX(messageEntityDTO.getRussellX());
        newOne.setRussellY(messageEntityDTO.getRussellY());
        return newOne;
    }

    @Override
    public MessageEntity insert(MessageEntity messageEntity) {
        Assert.notNull(messageEntity.getDiaryEntity(), "diaryEntity.diaryEntity must not be null");
        return messageRepository.save(messageEntity);
    }

    @Override
    public MessageEntity insertDTO(MessageEntityDTO messageEntityDTO) throws Exception {
        try {
            if (this.findById(messageEntityDTO.getMessageId()).get() != null)
                throw new Exception("Message already exists");
        } catch (NullPointerException e) {
            //Do nothing
        }
        if (messageEntityDTO.getDiaryId() == null) throw new Exception("Message를 등록할 Diary의 Id가 존재하지 않음");
        DiaryEntity diaryEntity = diaryService.findById(messageEntityDTO.getDiaryId()).get();
        if (diaryEntity == null) throw new Exception("Diary does not exist");
        MessageEntity newOne = getMessageEntity(messageEntityDTO, diaryEntity);
        newOne.setMessageId(null); // 새 Id 로 재지정될 것이므로 null 처리.
        return this.insert(newOne);
    }

    @Override
    public List<MessageEntity> insertDTOList(List<MessageEntityDTO> messageEntityDTOList) {
        return messageEntityDTOList.stream().map(m -> {
            try {
                return this.insertDTO(m);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }).toList();
    }

    @Override
    public Optional<MessageEntity> findById(int id) {
        return messageRepository.findById(id);
    }

    @Override
    public List<MessageEntity> findByDiaryEntity(DiaryEntity diaryEntity) {
        return messageRepository.findByDiaryEntity(diaryEntity);
    }

    @Override
    public List<MessageEntity> findByDiaryId(Integer diaryId) {
        return this.findByDiaryEntity(diaryService.findById(diaryId).get());
    }

    public MessageEntity updateDTO(MessageEntityDTO messageEntityDTO) {
        Optional<MessageEntity> optionalMessageEntity = messageRepository.findById(messageEntityDTO.getMessageId());
        if (optionalMessageEntity.isEmpty()) return null;
        MessageEntity messageEntity = optionalMessageEntity.get();
        messageEntity.setAudioKey(messageEntityDTO.getAudioKey());
        messageEntity.setSequence(messageEntityDTO.getSequence());
        messageEntity.setContent(messageEntityDTO.getContent());
        messageEntity.setSpeaker(messageEntityDTO.getSpeaker());
        return messageRepository.save(messageEntity);
    }

    @Override
    public void delete(MessageEntity messageDTOEntity) {
        //사전에 Check 되었다고 가정
        MessageEntity matchingEntity = messageRepository.findById(messageDTOEntity.getMessageId()).get();
        messageRepository.delete(matchingEntity);
    }

    @Override
    public void deleteDTO(MessageEntityDTO messageEntityDTO) {
        MessageEntity matchingEntity = messageRepository.findById(messageEntityDTO.getMessageId()).get();
        messageRepository.delete(matchingEntity);
    }

}
