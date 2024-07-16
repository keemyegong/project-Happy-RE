package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class DiaryEmotion extends BaseEntity{

    @Id
    @Column(name = "diary_emotion_id")
    private int diaryEmotionId;

    @ManyToOne
    @JoinColumn(name = "diary_id", nullable = false, foreignKey = @ForeignKey(name = "fk_diaryemotion_diary"))
    private Diary diary;

    @ManyToOne
    @JoinColumn(name = "emotion_id", nullable = false, foreignKey = @ForeignKey(name = "fk_diaryemotion_emotion"))
    private Emotion emotion;

}
