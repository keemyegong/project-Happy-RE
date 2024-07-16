package com.ssafy.api.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;

import java.io.IOException;
import java.security.GeneralSecurityException;

public interface OauthService
{
    public GoogleIdToken.Payload verifyGoogle(String idTokenString) throws GeneralSecurityException, IOException;
    public String verifyKakao(String acessToken) throws GeneralSecurityException, IOException ;
    public String getTokenKakao(String accessToken) throws GeneralSecurityException, IOException;
}
