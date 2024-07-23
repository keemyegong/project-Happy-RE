package com.example.happyre.repository;

import com.example.happyre.entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<MessageEntity, Integer>{}
