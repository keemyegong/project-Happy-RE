package com.example.happyre.controller;

import com.example.happyre.dto.usermessage.UserMessageDTO;
import com.example.happyre.entity.UserEntity;
import com.example.happyre.entity.UserMessageArchivedEntity;
import com.example.happyre.entity.UserMessageEntity;
import com.example.happyre.service.UserMessageArchivedService;
import com.example.happyre.service.UserMessageService;
import com.example.happyre.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "UserMessage")
@RestController
@RequestMapping("/api/usermsg")
@RequiredArgsConstructor
public class UserMessageController {

    private final UserService userService;
    private final UserMessageService userMessageService;

    private final UserMessageArchivedService userMessageArchivedService;

    @PostMapping()
    public ResponseEntity<?> createUserMsg(HttpServletRequest request, @RequestBody UserMessageDTO userMessageDTO) {
        try {
            UserEntity userEntity = userService.findByRequest(request);
            userMessageService.insertDTO(userMessageDTO, userEntity);
            return ResponseEntity.ok("등록 완료");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("UserMessage 등록중 에러: " + e.getMessage());
        }
    }

    @Operation(summary = "유저 메세지 추출", description = "현재 로그인된 사용자가 작성하지 않은 유저 메세지들 중에서 몇 개를 추출하여 가져옵니다.")
    @GetMapping("/{size}")
    public ResponseEntity<?> sample(HttpServletRequest request, @PathVariable Integer size) {
        try {
            return ResponseEntity.ok(userMessageService.sample(size, userService.findByRequest(request)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("UserMessage 샘플링중 에러: " + e.getMessage());
        }
    }

    @PostMapping("archive/{id}")
    public ResponseEntity<?> archiveUserMsg(HttpServletRequest request, @PathVariable Integer id) {
        System.out.println("In Controller");
        try {
            UserEntity userEntity = userService.findByRequest(request);
            UserMessageEntity userMessageEntity = userMessageService.findById(id).orElseThrow(() -> new RuntimeException("id 를 pk 로 가지는 userMessageEntity를 찾을 수 없음."));
            UserMessageArchivedEntity userMessageArchivedEntity = new UserMessageArchivedEntity();
            userMessageArchivedEntity.setUserEntity(userEntity);
            List<UserMessageArchivedEntity> userMessageArchivedEntityList = userMessageArchivedService.findByUserMessageEntityAndUserEntity(userMessageEntity, userEntity);
            if (userMessageArchivedEntityList.size() != 0)
                throw new RuntimeException("중복된 archive 기록이 존재함");//이미 존재하는지 체크
            //연관관계 설정
            userMessageArchivedEntity.setUserMessageEntity(userMessageEntity);
            userMessageEntity.getUserMessageArchivedEntityList().add(userMessageArchivedEntity);
            userMessageArchivedService.insert(userMessageArchivedEntity);
            return ResponseEntity.ok("등록 완료");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            System.out.println(e.getStackTrace());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("UserMessage Archive화 도중 에러: " + e.getMessage());
        }
    }

    @DeleteMapping("archive/{id}")
    public ResponseEntity<?> unArchiveUserMsg(HttpServletRequest request, @PathVariable Integer id) {
        try {
            UserEntity userEntity = userService.findByRequest(request);
            UserMessageEntity userMessageEntity = userMessageService.findById(id).orElseThrow(() -> new RuntimeException("id 를 pk 로 가지는 userMessageEntity를 찾을 수 없음."));
            List<UserMessageArchivedEntity> userMessageArchivedEntityList = userMessageArchivedService.findByUserMessageEntityAndUserEntity(userMessageEntity, userEntity);
            if (userMessageArchivedEntityList.size() == 0) throw new RuntimeException("archive 기록을 찾을 수 없음");
            if (userMessageArchivedEntityList.size() >= 2)
                throw new RuntimeException("같은 archive 기록이 두개 이상 존재함(Should Not Happen!)");
            userMessageArchivedService.delete(userMessageArchivedEntityList.get(0));
            return ResponseEntity.ok("삭제 완료");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("UserMessage Un-Archive화 도중 에러: " + e.getMessage());
        }
    }
}
