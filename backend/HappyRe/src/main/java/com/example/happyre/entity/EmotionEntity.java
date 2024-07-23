package com.example.happyre.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "emotion")
public class EmotionEntity {

    @Id
    @Column(name="emotion_id")
    private int emotionId;

    private String emotion;
}
