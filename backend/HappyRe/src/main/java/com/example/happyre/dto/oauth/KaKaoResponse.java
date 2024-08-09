package com.example.happyre.dto.oauth;

import java.util.Map;

public class KaKaoResponse implements OAuth2Response{
    private final Map<String, Object> attribute;
    public KaKaoResponse(Map<String, Object> attribute) {
        this.attribute = attribute;
    }
    @Override
    public String getProvider() {
        return "";
    }

    @Override
    public String getProviderId() {
        return "";
    }

    @Override
    public String getEmail() {
        return "";
    }

    @Override
    public String getName() {
        return "";
    }
}
