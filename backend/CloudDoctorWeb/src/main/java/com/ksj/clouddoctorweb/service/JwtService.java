package com.ksj.clouddoctorweb.service;

import com.ksj.clouddoctorweb.entity.User;

/**
 * JWT 토큰 서비스 인터페이스
 */
public interface JwtService {
    
    /**
     * 액세스 토큰 생성
     */
    String generateAccessToken(User user, String userAgent);
    
    /**
     * 리프레시 토큰 생성
     */
    String generateRefreshToken(User user);
    
    /**
     * 토큰에서 사용자명 추출
     */
    String extractUsername(String token);
    
    /**
     * 토큰 유효성 검증
     */
    boolean validateToken(String token, String userAgent);
    
    /**
     * 액세스 토큰을 Redis에 저장
     */
    void storeAccessToken(String username, String token);
    
    /**
     * Redis에서 액세스 토큰 조회
     */
    String getStoredAccessToken(String username);
    
    /**
     * Redis에서 액세스 토큰 삭제
     */
    void removeAccessToken(String username);
}