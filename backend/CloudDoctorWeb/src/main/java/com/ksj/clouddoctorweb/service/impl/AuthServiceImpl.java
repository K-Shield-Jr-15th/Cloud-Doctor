package com.ksj.clouddoctorweb.service.impl;

import com.ksj.clouddoctorweb.dto.LoginRequest;
import com.ksj.clouddoctorweb.dto.TokenResponse;
import com.ksj.clouddoctorweb.entity.User;
import com.ksj.clouddoctorweb.repository.UserRepository;
import com.ksj.clouddoctorweb.service.AuthService;
import com.ksj.clouddoctorweb.service.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * 인증 서비스 구현체
 */
@Service
@RequiredArgsConstructor
@Log4j2
public class AuthServiceImpl implements AuthService {
    
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public TokenResponse login(LoginRequest loginRequest, String userAgent) {
        User user = userRepository.findByUsername(loginRequest.getUsername())
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다");
        }
        
        String accessToken = jwtService.generateAccessToken(user, userAgent);
        String refreshToken = jwtService.generateRefreshToken(user);
        
        log.info("로그인 성공: {}", user.getUsername());
        return new TokenResponse(accessToken, refreshToken);
    }
    
    @Override
    public void logout(String username) {
        jwtService.removeAccessToken(username);
        log.info("로그아웃: {}", username);
    }
    
    @Override
    public TokenResponse refreshToken(String refreshToken, String userAgent) {
        String username = jwtService.extractUsername(refreshToken);
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        String newAccessToken = jwtService.generateAccessToken(user, userAgent);
        String newRefreshToken = jwtService.generateRefreshToken(user);
        
        return new TokenResponse(newAccessToken, newRefreshToken);
    }
}