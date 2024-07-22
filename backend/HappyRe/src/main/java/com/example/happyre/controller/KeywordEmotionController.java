package com.example.happyre.controller;

import com.example.happyre.entity.KeywordEmotionEntity;
import com.example.happyre.repository.EmotionRepository;
import com.example.happyre.repository.KeywordEmotionRepository;
import com.example.happyre.repository.KeywordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/keywordEmotion")
public class KeywordEmotionController {

    @Autowired
    private KeywordEmotionRepository keywordEmotionRepository;

    @Autowired
    private KeywordRepository keywordRepository;

    @Autowired
    private EmotionRepository emotionRepository;

    @GetMapping
    public List<KeywordEmotionEntity> getAllKeywordEmotions() {
        return keywordEmotionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<KeywordEmotionEntity> getKeywordEmotionById(@PathVariable Integer id) {
        Optional<KeywordEmotionEntity> keywordEmotion = keywordEmotionRepository.findById(id);
        return keywordEmotion.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public KeywordEmotionEntity createKeywordEmotion(@RequestBody KeywordEmotionEntity keywordEmotion) {
        return keywordEmotionRepository.save(keywordEmotion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<KeywordEmotionEntity> updateKeywordEmotion(@PathVariable Integer id, @RequestBody KeywordEmotionEntity keywordEmotionDetails) {
        return ResponseEntity.ok(keywordEmotionRepository.save(keywordEmotionDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteKeywordEmotion(@PathVariable Integer id) {
        Optional<KeywordEmotionEntity> keywordEmotion = keywordEmotionRepository.findById(id);
        if (!keywordEmotion.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        keywordEmotionRepository.delete(keywordEmotion.get());
        return ResponseEntity.noContent().build();
    }
}
