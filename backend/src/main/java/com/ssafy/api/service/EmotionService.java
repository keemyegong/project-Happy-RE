package com.ssafy.api.service;

import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.db.entity.Emotion;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.EmotionRepository;

public interface EmotionService {
	Emotion getEmotionById(int emotionId);
}
