package com.example.happyre.repository;

import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiaryRepository extends JpaRepository<DiaryEntity, Integer> {
    List<DiaryEntity> findByUserEntity(UserEntity userEntity);
}
