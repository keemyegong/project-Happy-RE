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

    @Column(name="diary_id")
    private Integer diary_id;

    @Column(nullable = false)
    private Integer sequence;

    @Column(nullable = false)
    private String keyword;

    @Column(columnDefinition = "TEXT")
    private String summary;

}
