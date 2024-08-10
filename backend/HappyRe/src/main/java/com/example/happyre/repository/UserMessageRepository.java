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


//    @Query(value = "SELECT um FROM UserMessageEntity um " +
//            "LEFT JOIN UserMessageArchivedEntity uma ON um.userEntity = uma.userEntity AND uma.userEntity = :userEntity " +
//            "WHERE um.userEntity != :userId " +
//            "AND uma.userMessageEntity IS NULL " +
//            "ORDER BY RAND() LIMIT :size")


//    @Query(value = "SELECT * FROM user_message WHERE user_id != :userId ORDER BY RAND() LIMIT :size", nativeQuery = true)
    @Query(value = "SELECT * \n" +
            "FROM user_message um \n" +
            "WHERE um.user_message_id NOT IN (\n" +
            "    SELECT uma.user_message_id \n" +
            "    FROM user_message_archived uma \n" +
            "    WHERE uma.user_id = :userId \n" +
            ")and um.user_id != :userId\n" +
            "ORDER BY RAND() LIMIT :size", nativeQuery = true)
    List<UserMessageEntity> findRandomEntities(@Param("size") int size, @Param("userId") Integer userId);

//    @Query(value = "SELECT um FROM UserMessageEntity um " +
//            "INNER JOIN UserMessageArchivedEntity uma ON um.userEntity = uma.userEntity AND uma.userEntity = :userEntity " +
//            "WHERE um.userEntity != :userId " +
//            "AND uma.userMessageEntity IS NULL " +
//            "ORDER BY RAND() LIMIT :size")
//    List<UserMessageEntity> findRandomEntities(@Param("size") int size, @Param("userEntity") UserEntity userEntity);


}
