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

    @Column(name="diary_id")
    private Integer diaryId;

    @Column(name="emotion_id")
    private Integer emotionId;
}
