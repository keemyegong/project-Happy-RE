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


    private Timestamp date;

    @PrePersist
    public void onCreate() {
        if (date == null) {
            date = new Timestamp(System.currentTimeMillis());
        }
    }

    @Column(columnDefinition = "TEXT", nullable = true)
    private String summary;

}