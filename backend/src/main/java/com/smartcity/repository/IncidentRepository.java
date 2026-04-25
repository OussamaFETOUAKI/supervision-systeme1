package com.smartcity.repository;

import com.smartcity.model.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByCreatorId(Long creatorId);

    // Sort by Urgency Score (High to Low)
    List<Incident> findAllByOrderByUrgencyScoreDesc();
}
