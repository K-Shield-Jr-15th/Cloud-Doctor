package com.ksj.clouddoctorweb.repository;

import com.ksj.clouddoctorweb.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByAccountIdIn(List<Long> accountIds);
}