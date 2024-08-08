package com.example.happyre.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.List;

@Table(name = "user_message")
@Entity
@NoArgsConstructor
@Getter
@Setter
public class UserMessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_message_id")
    private Integer userMessageId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity userEntity;

    @Column(name = "content")
    private String content;

    @CreationTimestamp
    @Column(updatable = false)
    private Timestamp date;

    //Non_column relationships
    @JsonManagedReference//prevent looping json output
    @OneToMany(mappedBy = "userMessageEntity", cascade = {CascadeType.PERSIST, CascadeType.REFRESH, CascadeType.REMOVE})
    List<UserMessageArchivedEntity> userMessageArchivedEntityList;

    @JsonManagedReference
    @OneToMany(mappedBy = "userMessageEntity", cascade = {CascadeType.PERSIST, CascadeType.REFRESH, CascadeType.REMOVE})
    List<UserMessageAttachedKeywordEntity> userMessageAttachedKeywordEntityList;
}
