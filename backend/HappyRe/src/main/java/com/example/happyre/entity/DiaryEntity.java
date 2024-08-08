package com.example.happyre.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.List;

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

    @Column(name = "russell_avg_x")
    private Double russellAvgX;

    @Column(name = "russell_avg_y")
    private Double russellAvgY;

    //Non_column_field
    @JsonManagedReference//prevent looping json output
    @OneToMany(mappedBy = "diaryEntity", cascade = {CascadeType.PERSIST, CascadeType.REFRESH, CascadeType.REMOVE})
    private List<DiaryEmotionEntity> diaryEmotionEntityList;

}