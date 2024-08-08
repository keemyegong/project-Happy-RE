package com.example.happyre.entity;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "UserWordFrequency")
@IdClass(UserWordFrequencyId.class)
public class UserWordFrequencyEntity {
    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;

    @Id
    @Column(name = "word")
    private String word;

    @Column(name = "frequency")
    private Integer frequency;

}
