package com.example.happyre.controller;

import com.example.happyre.entity.MessageEntity;
import com.example.happyre.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/message")
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    public List<MessageEntity> getAll() {
        return messageService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MessageEntity> getMessageById(@PathVariable Integer id) {
        Optional<MessageEntity> message = messageService.findById(id);
        return message.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public MessageEntity createMessage(@RequestBody MessageEntity message) {
        return messageService.insert(message);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MessageEntity> updateMessage(@PathVariable Integer id, @RequestBody MessageEntity messageDetails) {
        messageDetails.setMessageId(id);
        return ResponseEntity.ok(messageService.update(messageDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Integer id) {
        messageService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
}
