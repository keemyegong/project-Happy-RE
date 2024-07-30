package com.example.happyre.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "keyword")
public class KeywordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "keyword_id")
    private Integer keywordId;

    @ManyToOne
    @JoinColumn(name = "diary_id", nullable = false)
    private DiaryEntity diaryEntity;

    @Column(nullable = false)
    private Integer sequence;

    @Column(nullable = false)
    private String keyword;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "russell_x", nullable = false)
    private Double russellX;

    @Column(name = "russell_y", nullable = false)
    private Double russellY;

}
