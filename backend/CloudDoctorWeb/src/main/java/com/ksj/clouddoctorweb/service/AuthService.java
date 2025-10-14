package com.ksj.clouddoctorweb.service;

import com.ksj.clouddoctorweb.dto.LoginRequest;
import com.ksj.clouddoctorweb.dto.TokenResponse;

/**
 * 인증 서비스 인터페이스
 */
public interface AuthService {
    
    /**
     * 로그인 처리
     */
    TokenResponse login(LoginRequest loginRequest, String userAgent);
    
    /**
     * 로그아웃 처리
     */
    void logout(String username);
    
    /**
     * 토큰 갱신
     */
    TokenResponse refreshToken(String refreshToken, String userAgent);
}