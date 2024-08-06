package com.example.happyre.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Data
@Entity
@Table(name = "diary")
public class DiaryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diary_id")
    private Integer diaryId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;

    //TODO: Simplify: 사실상 DB에 아무것도 안 넣겠다는 말이라 좀 봐야함.
    //    @Column(nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    @CreationTimestamp
    @Column(updatable = false)
    private Timestamp date;

    @Column(columnDefinition = "TEXT", nullable = true)
    private String summary;

}