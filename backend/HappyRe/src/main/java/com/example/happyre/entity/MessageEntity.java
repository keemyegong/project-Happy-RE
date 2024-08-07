package com.example.happyre.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "message")
@NoArgsConstructor
public class MessageEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Integer messageId;

    @ManyToOne
    @JoinColumn(name = "diary_id", nullable = false)
    private DiaryEntity diaryEntity;

    @Column(nullable = false)
    private Integer sequence;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Speaker speaker;

    @Column(name = "audio_key", nullable = true)
    private String audioKey;

    @Column(nullable = true)
    private String summary;

    @Column(name = "russell_x", nullable = true)
    private Integer russellX;

    @Column(name = "russell_y", nullable = true)
    private Integer russellY;

    @Column(name = "archived")
    private Boolean archived = false;

    public enum Speaker {
        ai, user
    }
}
