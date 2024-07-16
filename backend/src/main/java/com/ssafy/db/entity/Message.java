package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class Message extends BaseEntity{

    @Id
    @Column(name = "message_id")
    private int messageId;

    @ManyToOne
    @JoinColumn(name = "diary_id", nullable = false, foreignKey = @ForeignKey(name = "fk_message_diary"))
    private Diary diary;

    @Column(name = "sequence", nullable = false)
    private int sequence;

    @Column(name = "content", nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "speaker", nullable = false)
    private Speaker speaker;

    @Column(name = "audio_key", unique = true)
    private String audioKey;

    public enum Speaker {
        AI, USER
    }
}
