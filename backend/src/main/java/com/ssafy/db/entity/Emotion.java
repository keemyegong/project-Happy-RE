package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Getter
@Setter
@ToString
public class Emotion extends BaseEntity{

    @Id
    @Column(name = "emotion_id")
    private int emotionId;

    @Column(name = "emotion", nullable = false, unique = true)
    private String emotion;
}

