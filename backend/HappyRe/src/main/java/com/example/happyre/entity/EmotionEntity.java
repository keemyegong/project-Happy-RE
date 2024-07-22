package com.example.happyre.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "emotion")
public class EmotionEntity {
    @Id
    @Column(name="emotion_id")
    private int emotionId;

    private String emotion;
}
