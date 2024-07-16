package com.ssafy.db.entity;

import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Getter
@Setter
public class Diary extends BaseEntity{

    @Id
    @Column(name = "diary_id")
    private int diaryId;

    @Column(name = "date", nullable = false)
    private Timestamp date;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_diary_user"))
    private User user;

    @Column(name = "summary")
    private String summary;
}
