package com.example.happyre.repository;

import com.example.happyre.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    UserEntity findByEmail(String email);

}
