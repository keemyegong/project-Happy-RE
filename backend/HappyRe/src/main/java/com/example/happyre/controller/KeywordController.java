package com.example.happyre.controller;

import com.example.happyre.entity.KeywordEntity;
import com.example.happyre.repository.DiaryRepository;
import com.example.happyre.repository.KeywordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/keyword")
public class KeywordController {

    @Autowired
    private KeywordRepository keywordRepository;

    @Autowired
    private DiaryRepository diaryRepository;

    @GetMapping
    public List<KeywordEntity> getAllKeywords() {
        return keywordRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<KeywordEntity> getKeywordById(@PathVariable Integer id) {
        Optional<KeywordEntity> keyword = keywordRepository.findById(id);
        return keyword.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public KeywordEntity createKeyword(@RequestBody KeywordEntity keyword) {
        return keywordRepository.save(keyword);
    }

    @PutMapping("/{id}")
    public ResponseEntity<KeywordEntity> updateKeyword(@PathVariable Integer id, @RequestBody KeywordEntity keywordDetails) {
        return ResponseEntity.ok(keywordRepository.save(keywordDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteKeyword(@PathVariable Integer id) {
        Optional<KeywordEntity> keyword = keywordRepository.findById(id);
        if (!keyword.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        keywordRepository.delete(keyword.get());
        return ResponseEntity.noContent().build();
    }
}
