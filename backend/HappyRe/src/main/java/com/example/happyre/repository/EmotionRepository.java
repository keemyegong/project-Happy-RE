package com.example.happyre.repository;

import com.example.happyre.entity.EmotionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmotionRepository extends JpaRepository<EmotionEntity, Integer>{}
