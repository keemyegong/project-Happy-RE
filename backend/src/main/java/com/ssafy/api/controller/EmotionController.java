// test
package com.ssafy.api.controller;

import com.ssafy.api.service.EmotionService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Emotion;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Api(value = "Test Emotion API", tags = {"Emotion"})
@RestController
@RequestMapping("/api/emotion")
public class EmotionController {
	
	@Autowired
	EmotionService emotionService;
	
	@GetMapping()
	@ApiOperation(value = "Test 감정 조회", notes = "QueryDsl 과 DB의 작동을 확인하기 위한 항목")
    @ApiResponses({
        @ApiResponse(code = 200, message = "성공"),
        @ApiResponse(code = 500, message = "서버 오류")
    })
	public ResponseEntity<? extends BaseResponseBody> getEmotion(@RequestParam("emotionid") int emotionId) {

		Emotion emotion = emotionService.getEmotionById(emotionId);
		System.out.println(emotion.toString());
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, emotion.toString()));
	}
}
