package com.example.happyre.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "keyword_emotion")
public class KeywordEmotionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "keyword_emotion_id")
    private Integer keywordEmotionId;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "keyword_id")
    private KeywordEntity keywordEntity;

    @ManyToOne
    @JoinColumn(name = "emotion_id")
    private EmotionEntity emotionEntity;

}
