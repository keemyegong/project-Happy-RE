package com.example.happyre.repository;

import com.example.happyre.entity.UserAvgEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAvgRepository extends JpaRepository<UserAvgEntity, Integer> {
    // 예: 사용자 ID로 UserAvgEntity를 찾는 메서드
    UserAvgEntity findByUserId(int userId);
}