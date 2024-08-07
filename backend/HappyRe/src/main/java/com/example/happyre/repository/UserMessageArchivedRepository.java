package com.example.happyre.repository;

import com.example.happyre.entity.UserEntity;
import com.example.happyre.entity.UserMessageArchivedEntity;
import com.example.happyre.entity.UserMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserMessageArchivedRepository extends JpaRepository<UserMessageArchivedEntity, Integer> {
    @Query("SELECT uma FROM UserMessageArchivedEntity uma WHERE uma.userMessageEntity = :userMessageEntity AND uma.userEntity = :userEntity")
    List<UserMessageArchivedEntity> findByUserMessageEntityAndUserEntity(@Param("userMessageEntity") UserMessageEntity userMessageEntity, @Param("userEntity") UserEntity userEntity);
}
