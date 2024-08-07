package com.example.happyre.controller;

import com.example.happyre.dto.archived.ArchivedResponseDTO;
import com.example.happyre.entity.KeywordEntity;
import com.example.happyre.entity.MessageEntity;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.entity.UserMessageEntity;
import com.example.happyre.service.KeywordService;
import com.example.happyre.service.MessageService;
import com.example.happyre.service.UserMessageService;
import com.example.happyre.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Archived")
@RequestMapping("/api/archived")
@RestController
@RequiredArgsConstructor
public class ArchiveController {

    private static final Logger logger = LoggerFactory.getLogger(DiaryController.class);//no useage, just in case

    private final MessageService messageService;
    private final KeywordService keywordService;
    private final UserService userService;
    private final UserMessageService userMessageService;

    @Operation(summary = "아카이브 모두 조회", description = "해당 유저의 아카이빙 된 Keyword, Message, UserMessage들을 전부 가져옵니다.")
    @GetMapping
    public ResponseEntity<?> getAllArchived(HttpServletRequest request) {
        try {
            UserEntity userEntity = userService.findByRequest(request);
            List<KeywordEntity> archivedKeywords = keywordService.findByArchivedAndUserEntity(true, userEntity);
            List<MessageEntity> archivedMessages = messageService.findByArchivedAndUserEntity(true, userEntity);
            List<UserMessageEntity> archivedUserMsg = userMessageService.findArchivedByUserEntity(userEntity);
            ArchivedResponseDTO resObj = new ArchivedResponseDTO();
            resObj.setKeywordEntityList(archivedKeywords);
            resObj.setMessageEntityList(archivedMessages);
            resObj.setUserMessageEntityList((archivedUserMsg));
            return ResponseEntity.ok(resObj);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Archived 조회중 에러: " + e.getMessage());
        }
    }

}
