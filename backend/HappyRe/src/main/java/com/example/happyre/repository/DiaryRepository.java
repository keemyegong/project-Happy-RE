package com.example.happyre.repository;

import com.example.happyre.entity.DiaryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiaryRepository extends JpaRepository<DiaryEntity, Integer>{}
