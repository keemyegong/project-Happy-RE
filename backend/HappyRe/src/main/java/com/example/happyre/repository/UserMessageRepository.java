package com.example.happyre.repository;

import com.example.happyre.entity.UserEntity;
import com.example.happyre.entity.UserMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserMessageRepository extends JpaRepository<UserMessageEntity, Integer> {
    @Query("SELECT um FROM UserMessageArchivedEntity uma INNER JOIN uma.userMessageEntity um WHERE uma.userEntity = :userEntity")
    List<UserMessageEntity> findArchivedByUserEntity(@Param("userEntity") UserEntity userEntity);

    @Query(value = "SELECT * FROM user_message WHERE user_id != :userId ORDER BY RAND() LIMIT :size", nativeQuery = true)
    List<UserMessageEntity> findRandomEntities(@Param("size") int size, @Param("userId") Integer userId);
}
