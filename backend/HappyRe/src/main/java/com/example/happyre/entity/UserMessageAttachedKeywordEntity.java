package com.example.happyre.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "user_message_attached_keyword")
@Entity
@NoArgsConstructor
@Getter
@Setter
public class UserMessageAttachedKeywordEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_message_attached_keyword_id")
    private Integer userMessageAttachedKeywordId;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "user_message_id", nullable = false)
    private UserMessageEntity userMessageEntity;

    @ManyToOne
    @JoinColumn(name = "keyword_id", nullable = false)
    private KeywordEntity keywordEntity;
}
