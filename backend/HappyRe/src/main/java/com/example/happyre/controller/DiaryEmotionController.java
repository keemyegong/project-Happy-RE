package com.example.happyre.controller;

import com.example.happyre.entity.DiaryEmotionEntity;
import com.example.happyre.repository.DiaryEmotionRepository;
import com.example.happyre.repository.DiaryRepository;
import com.example.happyre.repository.EmotionRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@Tag(name = "Operation not guaranteed")
@RestController
@RequestMapping("/api/diaryEmotion")
public class DiaryEmotionController {

    @Autowired
    private DiaryEmotionRepository diaryEmotionRepository;

    @Autowired
    private DiaryRepository diaryRepository;

    @Autowired
    private EmotionRepository emotionRepository;

    @GetMapping
    public List<DiaryEmotionEntity> getAllDiaryEmotions() {
        return diaryEmotionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiaryEmotionEntity> getDiaryEmotionById(@PathVariable Integer id) {
        Optional<DiaryEmotionEntity> diaryEmotion = diaryEmotionRepository.findById(id);
        return diaryEmotion.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public DiaryEmotionEntity createDiaryEmotion(@RequestBody DiaryEmotionEntity diaryEmotion) {
        return diaryEmotionRepository.save(diaryEmotion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiaryEmotionEntity> updateDiaryEmotion(@PathVariable Integer id, @RequestBody DiaryEmotionEntity diaryEmotionDetails) {
        return ResponseEntity.ok(diaryEmotionRepository.save(diaryEmotionDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiaryEmotion(@PathVariable Integer id) {
        Optional<DiaryEmotionEntity> diaryEmotion = diaryEmotionRepository.findById(id);
        if (!diaryEmotion.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        diaryEmotionRepository.delete(diaryEmotion.get());
        return ResponseEntity.noContent().build();
    }
}
