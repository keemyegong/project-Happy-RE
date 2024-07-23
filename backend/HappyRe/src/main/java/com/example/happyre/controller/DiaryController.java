package com.example.happyre.controller;

import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.service.DiaryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@Tag(name = "Diary")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/diary")
public class DiaryController {
    
    private final DiaryService diaryService;

    @GetMapping
    public List<DiaryEntity> getAllDiaries() {
        return diaryService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiaryEntity> getDiaryById(@PathVariable Integer id) {
        Optional<DiaryEntity> diary = diaryService.findById(id);
        return diary.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public DiaryEntity createDiary(@RequestBody DiaryEntity diary) {
        return diaryService.insert(diary);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiaryEntity> updateDiary(@PathVariable Integer id, @RequestBody DiaryEntity diaryDetails) {
        diaryDetails.setDiaryId(id);
        return ResponseEntity.ok(diaryService.update(diaryDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiary(@PathVariable Integer id) {
        diaryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
