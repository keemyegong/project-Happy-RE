package com.example.happyre.dto.usermessage;

import com.example.happyre.dto.keyword.KeywordEntityDTO;
import lombok.Data;

import java.util.List;

@Data
public class UserMessageDTO {
    private String content;
    private List<KeywordEntityDTO> keywordEntityDTOList;
}
