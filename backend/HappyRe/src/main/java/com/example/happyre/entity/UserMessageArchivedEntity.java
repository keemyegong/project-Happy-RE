package com.example.happyre.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "user_message_archived")
@Entity
@NoArgsConstructor
@Getter
@Setter
public class UserMessageArchivedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_message_archived_id")
    private Integer userMessageArchivedId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity userEntity;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "user_message_id", nullable = false)
    private UserMessageEntity userMessageEntity;
}
