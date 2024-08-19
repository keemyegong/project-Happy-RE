package com.example.happyre.repository;

import com.example.happyre.entity.DiaryEntity;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.entity.UserMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface UserMessageRepository extends JpaRepository<UserMessageEntity, Integer> {

    @Query("SELECT um FROM UserMessageEntity um WHERE (:currentDate IS NULL OR FUNCTION('DATE', um.date) = :currentDate) AND (:userEntity IS NULL OR um.userEntity = :userEntity)")
    List<UserMessageEntity> findByUserEntityAndDate(@Param("userEntity") UserEntity userEntity, @Param("currentDate") Date currentDate);

    @Query("SELECT um FROM UserMessageArchivedEntity uma INNER JOIN uma.userMessageEntity um WHERE uma.userEntity = :userEntity")
    List<UserMessageEntity> findArchivedByUserEntity(@Param("userEntity") UserEntity userEntity);

    @Query(value = "SELECT * \n" +
            "FROM user_message um \n" +
            "WHERE um.user_message_id NOT IN (\n" +
            "    SELECT uma.user_message_id \n" +
            "    FROM user_message_archived uma \n" +
            "    WHERE uma.user_id = :userId \n" +
            ")and um.user_id != :userId\n" +
            "ORDER BY RAND() LIMIT :size", nativeQuery = true)
    List<UserMessageEntity> findRandomEntities(@Param("size") int size, @Param("userId") Integer userId);

}
