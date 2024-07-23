package com.example.happyre.controller;

import com.example.happyre.entity.EmotionEntity;
import com.example.happyre.repository.EmotionRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Tag(name = "Emotion")
@RestController
@RequestMapping("/api/emotion")
public class EmotionController {

    @Autowired
    private EmotionRepository emotionRepository;

    @Operation
    @GetMapping
    public List<EmotionEntity> getAllEmotions() {
        return emotionRepository.findAll();
    }

    @GetMapping("/{id}")
    public EmotionEntity getEmotionById(@PathVariable Integer id) {
        Optional<EmotionEntity> emotion = emotionRepository.findById(id);
        return emotion.orElse(null);
    }

    @PostMapping
    public EmotionEntity createEmotion(@RequestBody EmotionEntity emotion) {
        return emotionRepository.save(emotion);
    }

    @PutMapping("/{id}")
    public EmotionEntity updateEmotion(@PathVariable Integer id, @RequestBody EmotionEntity emotionDetails) {
        Optional<EmotionEntity> emotionOptional = emotionRepository.findById(id);
        if (emotionOptional.isPresent()) {
            EmotionEntity emotion = emotionOptional.get();
            emotion.setEmotion(emotionDetails.getEmotion());
            return emotionRepository.save(emotion);
        } else {
            return null; // or throw an exception
        }
    }

    @DeleteMapping("/{id}")
    public void deleteEmotion(@PathVariable Integer id) {
        emotionRepository.deleteById(id);
    }
}
