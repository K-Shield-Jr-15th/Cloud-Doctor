package com.ksj.clouddoctorweb.repository;

import com.ksj.clouddoctorweb.entity.Checklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ChecklistRepository extends JpaRepository<Checklist, Long> {
    List<Checklist> findByGuidelineIdAndIsActiveTrue(Long guidelineId);
    List<Checklist> findByCloudProviderIdAndServiceListIdAndIsActiveTrue(Long cloudProviderId, Long serviceListId);
    
    @Query("SELECT c FROM Checklist c WHERE c.isActive = true ORDER BY c.cloudProvider.id, c.serviceList.id, c.guideline.id")
    List<Checklist> findAllActiveOrderedByProviderServiceGuideline();
}