package com.example.happyre.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "diary_emotion")
public class DiaryEmotionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diary_emotion_id")
    private Integer diaryEmotionId;

    @ManyToOne
    @JoinColumn(name = "emotion_id")
    private EmotionEntity emotionEntity;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "diary_id")
    private DiaryEntity diaryEntity;
}
