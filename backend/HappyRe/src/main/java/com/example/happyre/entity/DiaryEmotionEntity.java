package com.example.happyre.entity;

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
    @JoinColumn(name = "diary_id")
    private DiaryEntity diaryEntity;

    @ManyToOne
    @JoinColumn(name = "emotion_id")
    private EmotionEntity emotionEntity;
}
