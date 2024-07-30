package com.example.happyre.controller;

import com.example.happyre.dto.message.MessageEntityDTO;
import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.MessageEntity;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.service.DiaryService;
import com.example.happyre.service.MessageService;
import com.example.happyre.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Tag(name = "Message")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/message")
public class MessageController {

    private static final Logger logger = LoggerFactory.getLogger(DiaryController.class);//just in case
    private final MessageService messageService;
    private final UserService userService;
    private final DiaryService diaryService;

    @PostMapping
    public ResponseEntity<?> createMessage(HttpServletRequest request, @RequestBody MessageEntityDTO messageEntityDTO) {
        try {
            UserEntity userEntity = userService.findByRequest(request);
            Optional<DiaryEntity> opDiaryEntity = diaryService.findById(messageEntityDTO.getDiaryId());
            DiaryEntity diaryEntity;
            //다이어리가 있는지 체크
            if (opDiaryEntity.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("다이어리 없음");
            } else {
                logger.debug("Diary 있음. 재사용.");
                diaryEntity = opDiaryEntity.get();
                if (!userService.findByRequest(request).getId().equals(diaryEntity.getUserEntity().getId()))
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한 없음(유저 불일치)");
            }
            MessageEntity messageEntity = new MessageEntity();
            messageEntity.setDiaryEntity(diaryEntity);
            messageEntity.setAudioKey(messageEntityDTO.getAudioKey());
            messageEntity.setSequence(messageEntityDTO.getSequence());
            messageEntity.setContent(messageEntityDTO.getContent());
            messageEntity.setSpeaker(messageEntityDTO.getSpeaker());

            return ResponseEntity.ok(messageService.insert(messageEntity));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Message 생성중 에러: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMessageById(HttpServletRequest request, @PathVariable Integer id) {
        try {
            Optional<MessageEntity> optionalMessageEntity = messageService.findById(id);
            if (optionalMessageEntity.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Message 없음");

            MessageEntity messageEntity = optionalMessageEntity.get();
            UserEntity userEntity = userService.findByRequest(request);
            if (!userEntity.getId().equals(messageEntity.getDiaryEntity().getUserEntity().getId()))
                ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한 없음(유저 불일치)");
            return ResponseEntity.ok(messageEntity);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Message 검색중 에러: " + e.getMessage());
        }
    }

    @GetMapping("/diary/{diaryId}")
    public ResponseEntity<?> getMessageByDiaryId(HttpServletRequest request, @PathVariable Integer diaryId) {
        try {
            Optional<DiaryEntity> opDiaryEntity = diaryService.findById(diaryId);
            if (opDiaryEntity.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Diary 없음");
            DiaryEntity diaryEntity = opDiaryEntity.get();
            if (!userService.findByRequest(request).getId().equals(diaryEntity.getUserEntity().getId()))
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한 없음(유저 불일치)");
            List<MessageEntity> messages = messageService.findByDiaryEntity(diaryEntity);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Diary Id로 Message 검색중 에러: " + e.getMessage());
        }
    }

    @PutMapping("/")
    public ResponseEntity<?> updateMessage(HttpServletRequest request, @RequestBody MessageEntityDTO messageEntityDTO) {
        try {
            Optional<MessageEntity> optionalMessageEntity = messageService.findById(messageEntityDTO.getMessageId());
            if (optionalMessageEntity.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Message 없음");
            MessageEntity messageEntity = optionalMessageEntity.get();
            UserEntity userEntity = userService.findByRequest(request);
            if (!userEntity.getId().equals(messageEntity.getDiaryEntity().getUserEntity().getId()))
                ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한 없음(유저 불일치)");
            messageEntity.setAudioKey(messageEntityDTO.getAudioKey());
            messageEntity.setSequence(messageEntityDTO.getSequence());
            messageEntity.setContent(messageEntityDTO.getContent());
            messageEntity.setSpeaker(messageEntityDTO.getSpeaker());
            return ResponseEntity.ok(messageService.update(messageEntity));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Message 수정중 에러: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMessage(HttpServletRequest request, @PathVariable Integer id) {
        try {
            Optional<MessageEntity> optionalMessageEntity = messageService.findById(id);
            if (optionalMessageEntity.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Message 없음");
            MessageEntity messageEntity = optionalMessageEntity.get();
            UserEntity userEntity = userService.findByRequest(request);
            if (!userEntity.getId().equals(messageEntity.getDiaryEntity().getUserEntity().getId()))
                ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한 없음(유저 불일치)");
            messageService.delete(messageEntity);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Message 삭제중 에러: " + e.getMessage());
        }
    }

}
