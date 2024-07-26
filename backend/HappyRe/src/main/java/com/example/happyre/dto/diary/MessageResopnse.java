package com.example.happyre.dto.diary;

import lombok.Data;

@Data
public class MessageResopnse {
    private int diaryid;
    private String content;
    private String speaker;
    private String audiokey;
}
