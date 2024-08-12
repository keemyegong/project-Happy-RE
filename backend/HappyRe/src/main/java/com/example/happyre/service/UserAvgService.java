package com.example.happyre.service;

import com.example.happyre.entity.UserAvgEntity;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.repository.UserAvgRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

@Service
public class UserAvgService {
    private final UserAvgRepository usrAvgRepo;
    private final UserService userService;

    public UserAvgService(UserAvgRepository usrAvgRepo, UserService usrService) {
        this.usrAvgRepo = usrAvgRepo;
        this.userService = usrService;
    }

    public UserEntity getUserEntity(HttpServletRequest req){
        return userService.findByRequest(req);
    }
    public UserAvgEntity getUserAvg(int userId){
        UserAvgEntity userAvgEntity = usrAvgRepo.findByUserId(userId);
        if(userAvgEntity == null){
            userAvgEntity = new UserAvgEntity();
            userAvgEntity.setUserId(userId);
        }
        return userAvgEntity ;
    }
    public UserAvgEntity getUserAvgEntityByReq(HttpServletRequest req){
        UserEntity userEntity = getUserEntity(req);
        UserAvgEntity userAvgEntity = usrAvgRepo.findByUserId(userEntity.getId());
        if(userAvgEntity == null){
            userAvgEntity = new UserAvgEntity();
            userAvgEntity.setUserId(userEntity.getId());
        }
        return userAvgEntity ;
    }
    public void setAvgByReq(HttpServletRequest req,  double x, double y){
        UserAvgEntity userAvgEntity = getUserAvgEntityByReq(req);
        userAvgEntity.setRussellSumX(userAvgEntity.getRussellSumX() + x);
        userAvgEntity.setRussellSumY(userAvgEntity.getRussellSumY() + y);
        userAvgEntity.setCnt(userAvgEntity.getCnt() + 1);
        usrAvgRepo.save(userAvgEntity);
    }

    public void setAvg(int userId, double x, double y){
        UserAvgEntity userAvgEntity = getUserAvg(userId);
        userAvgEntity.setRussellSumX(userAvgEntity.getRussellSumX() + x);
        userAvgEntity.setRussellSumY(userAvgEntity.getRussellSumY() + y);
        userAvgEntity.setCnt(userAvgEntity.getCnt() + 1);

        usrAvgRepo.save(userAvgEntity);
    }


}
