package com.example.happyre.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "emotion")
public class EmotionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "emotion_id")
    private Integer emotionId;

    private String emotion;
}
