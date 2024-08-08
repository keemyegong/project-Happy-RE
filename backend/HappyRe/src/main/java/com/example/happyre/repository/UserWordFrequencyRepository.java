package com.example.happyre.repository;

import com.example.happyre.entity.UserEntity;
import com.example.happyre.entity.UserWordFrequencyEntity;
import com.example.happyre.entity.UserWordFrequencyId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserWordFrequencyRepository extends JpaRepository<UserWordFrequencyEntity, UserWordFrequencyId> {
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO UserWordFrequency (user_id, word, frequency) VALUES (?1, ?2, ?3) " +
            "ON DUPLICATE KEY UPDATE frequency = frequency + 1", nativeQuery = true)
    void upsertFrequency(Integer userId, String word, Integer frequency);

    @Query("SELECT u FROM UserWordFrequencyEntity u WHERE u.userEntity = :userEntity")
    List<UserWordFrequencyEntity> findByUserEntity(@Param("userEntity") UserEntity userEntity);


}
