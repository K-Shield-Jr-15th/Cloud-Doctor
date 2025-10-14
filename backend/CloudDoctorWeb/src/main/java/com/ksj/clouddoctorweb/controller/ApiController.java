package com.ksj.clouddoctorweb.controller;

import com.ksj.clouddoctorweb.entity.*;
import com.ksj.clouddoctorweb.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Cloud Doctor API v1 컨트롤러
 * 프론트엔드에서 필요한 데이터를 제공하는 REST API
 */
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Log4j2
public class ApiController {
    
    private final UserRepository userRepository;
    private final CloudProviderRepository cloudProviderRepository;
    private final ResourceRepository resourceRepository;
    
    /**
     * 전체 사용자 목록 조회
     * @return 사용자 리스트
     */
    @GetMapping("/users")
    public List<User> getUsers() {
        log.info("사용자 목록 조회 요청");
        List<User> users = userRepository.findAll();
        log.info("사용자 {} 명 조회됨", users.size());
        return users;
    }
    
    /**
     * 활성화된 클라우드 제공업체 목록 조회
     * @return 클라우드 제공업체 리스트
     */
    @GetMapping("/providers")
    public List<CloudProvider> getProviders() {
        log.info("클라우드 제공업체 목록 조회 요청");
        return cloudProviderRepository.findByIsActiveTrue();
    }
    
    /**
     * 전체 리소스 목록 조회
     * @return 리소스 리스트
     */
    @GetMapping("/resources")
    public List<Resource> getResources() {
        log.info("전체 리소스 목록 조회 요청");
        return resourceRepository.findAll();
    }
    
    /**
     * 특정 사용자의 리소스 목록 조회
     * @param userId 사용자 ID
     * @return 해당 사용자의 리소스 리스트
     */
    @GetMapping("/resources/user/{userId}")
    public List<Resource> getResourcesByUser(@PathVariable Long userId) {
        log.info("사용자 ID {} 의 리소스 조회 요청", userId);
        return resourceRepository.findByAccountIdIn(
            userRepository.findById(userId)
                .map(user -> List.of(user.getId()))
                .orElse(List.of())
        );
    }
}