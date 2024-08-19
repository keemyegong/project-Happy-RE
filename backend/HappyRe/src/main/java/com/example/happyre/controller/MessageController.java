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

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    public ResponseEntity<?> createMessage(HttpServletRequest request, @RequestBody List<MessageEntityDTO> messageEntityDTOs) {
        System.out.println("createMessage :" + messageEntityDTOs.toString());
        try {
            UserEntity userEntity = userService.findByRequest(request);
            if (userEntity == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }
            System.out.println("user Entity : " + userEntity.toString());
            LocalDateTime targetDate = LocalDateTime.parse(messageEntityDTOs.get(0).getDate());
            List<DiaryEntity> diaryEntityList = diaryService.findByUserAndDate(userEntity, Date.valueOf(targetDate.toLocalDate()));
            if (diaryEntityList.isEmpty()) {
                //만들고 시작
                DiaryEntity diaryEntity = new DiaryEntity();
                diaryEntity.setUserEntity(userEntity);
                diaryEntity.setDate(Timestamp.valueOf(targetDate));
                diaryEntityList.add(diaryService.insert(diaryEntity));
            }
            DiaryEntity diaryEntity = diaryEntityList.get(0);
            System.out.println("Diary Entity : " + diaryEntity.toString());
            ArrayList<MessageEntity> messageEntities = messageService.insertMessageDTOList(diaryEntity, messageEntityDTOs);

            return ResponseEntity.ok("Successfully created message" + messageEntities);
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

    @PutMapping("/{id}")
    public ResponseEntity<?> updateArchived(HttpServletRequest request,
                                            @PathVariable Integer id,
                                            @RequestParam(required = true) Boolean archived) {
        try {
            messageService.updateArchive(id, archived);
            return ResponseEntity.ok("Successfully updated message");
        } catch (IllegalAccessError e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Message Not Found : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error : " + e.getMessage());
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
            return ResponseEntity.ok(messageService.updateDTO(messageEntityDTO));
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
