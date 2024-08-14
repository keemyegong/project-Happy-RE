package com.example.happyre.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "user_avg")
public class UserAvgEntity {
    @Id
    @Column(name = "user_id") // 컬럼 이름 지정
    private int userId;

    @Column(name = "russell_sum_x", nullable = false)
    private double russellSumX = 0;

    @Column(name = "russell_sum_y", nullable = false)
    private double russellSumY = 0;

    @Column(nullable = false)
    private int cnt = 0;

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private UserEntity user;

}
