package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class Keyword extends BaseEntity{

    @Id
    @Column(name = "keyword_id")
    private int keywordId;

    @ManyToOne
    @JoinColumn(name = "diary_id", nullable = false, foreignKey = @ForeignKey(name = "fk_keyword_diary"))
    private Diary diary;

    @Column(name = "sequence", nullable = false)
    private int sequence;

    @Column(name = "keyword", nullable = false)
    private String keyword;

    @Column(name = "summary", nullable = false)
    private String summary;

}
