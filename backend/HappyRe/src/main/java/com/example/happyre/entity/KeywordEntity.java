package com.example.happyre.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

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

    @Column(name = "russell_x", nullable = true)
    private Double russellX;

    @Column(name = "russell_y", nullable = true)
    private Double russellY;

    @Column(name = "archived")
    private Boolean archived = false;

    //Non_column_field
    @JsonManagedReference//prevent looping json output
    @OneToMany(mappedBy = "keywordEntity", cascade = {CascadeType.PERSIST, CascadeType.REFRESH, CascadeType.REMOVE})
    private List<KeywordEmotionEntity> keywordEmotionEntityList;


}
