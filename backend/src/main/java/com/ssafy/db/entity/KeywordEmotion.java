package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class KeywordEmotion extends BaseEntity{

    @Id
    @Column(name = "keyword_emotion_id")
    private int keywordEmotionId;

    @ManyToOne
    @JoinColumn(name = "keyword_id", nullable = false, foreignKey = @ForeignKey(name = "fk_keywordemotion_keyword"))
    private Keyword keyword;

    @ManyToOne
    @JoinColumn(name = "emotion_id", nullable = false, foreignKey = @ForeignKey(name = "fk_keywordemotion_emotion"))
    private Emotion emotion;

}
