package com.ksj.clouddoctorweb.service.impl;

import com.ksj.clouddoctorweb.entity.User;
import com.ksj.clouddoctorweb.service.JwtService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.concurrent.TimeUnit;

/**
 * JWT 토큰 서비스 구현체
 */
@Service
@RequiredArgsConstructor
@Log4j2
public class JwtServiceImpl implements JwtService {
    
    private final RedisTemplate<String, String> redisTemplate;
    
    @Value("${jwt.secret:cloudDoctorSecretKeyForJwtTokenGeneration2024}")
    private String jwtSecret;
    
    @Value("${jwt.access-token-expiration:300000}") // 5분
    private long accessTokenExpiration;
    
    @Value("${jwt.refresh-token-expiration:604800000}") // 7일
    private long refreshTokenExpiration;
    
    private SecretKey getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(Base64.getEncoder().encodeToString(jwtSecret.getBytes()));
        return Keys.hmacShaKeyFor(keyBytes);
    }
    
    @Override
    public String generateAccessToken(User user, String userAgent) {
        String token = Jwts.builder()
                .subject(user.getUsername())
                .claim("role", user.getRole().name())
                .claim("fullName", user.getFullName())
                .claim("userAgent", userAgent)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(getSigningKey())
                .compact();
        
        storeAccessToken(user.getUsername(), token);
        log.info("액세스 토큰 생성: {}", user.getUsername());
        return token;
    }
    
    @Override
    public String generateRefreshToken(User user) {
        return Jwts.builder()
                .subject(user.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(getSigningKey())
                .compact();
    }
    
    @Override
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    @Override
    public boolean validateToken(String token, String userAgent) {
        try {
            Claims claims = extractAllClaims(token);
            String tokenUserAgent = claims.get("userAgent", String.class);
            String username = claims.getSubject();
            String storedToken = getStoredAccessToken(username);
            
            return !isTokenExpired(token) && 
                   token.equals(storedToken) && 
                   userAgent.equals(tokenUserAgent);
        } catch (Exception e) {
            log.error("토큰 검증 실패: {}", e.getMessage());
            return false;
        }
    }
    
    @Override
    public void storeAccessToken(String username, String token) {
        redisTemplate.opsForValue().set(
            "access_token:" + username, 
            token, 
            accessTokenExpiration, 
            TimeUnit.MILLISECONDS
        );
    }
    
    @Override
    public String getStoredAccessToken(String username) {
        return redisTemplate.opsForValue().get("access_token:" + username);
    }
    
    @Override
    public void removeAccessToken(String username) {
        redisTemplate.delete("access_token:" + username);
    }
    
    private <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}