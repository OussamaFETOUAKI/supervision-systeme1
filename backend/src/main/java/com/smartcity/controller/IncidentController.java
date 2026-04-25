package com.smartcity.controller;

import com.smartcity.dto.IncidentDTO;
import com.smartcity.dto.StatusUpdateDTO;
import com.smartcity.model.Incident;
import com.smartcity.service.IncidentService;
import com.smartcity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "*")
public class IncidentController {

    @Autowired
    private IncidentService incidentService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Incident> createIncident(@RequestBody IncidentDTO dto) {
        Incident incident = convertToEntity(dto);
        Incident created = incidentService.createIncident(incident);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Incident>> getIncidents(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String urgency) {
        return ResponseEntity.ok(incidentService.getFilteredIncidents(status, urgency));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Incident> getIncidentById(@PathVariable Long id) {
        Incident incident = incidentService.getIncidentById(id);
        return incident != null ? ResponseEntity.ok(incident) : ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{userId}")
    public List<Incident> getUserIncidents(@PathVariable Long userId) {
        return incidentService.getUserIncidents(userId);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Incident> updateStatus(@PathVariable Long id, @RequestBody StatusUpdateDTO dto) {
        Incident updated = incidentService.updateStatus(id, dto.getStatus());
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Incident> updateIncident(@PathVariable Long id, @RequestBody IncidentDTO dto) {
        Incident incident = convertToEntity(dto);
        Incident updated = incidentService.updateIncident(id, incident);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = incidentService.getStats();
        stats.put("agents", userRepository.count());
        return ResponseEntity.ok(stats);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncident(@PathVariable Long id) {
        incidentService.deleteIncident(id);
        return ResponseEntity.noContent().build();
    }

    private Incident convertToEntity(IncidentDTO dto) {
        Incident incident = new Incident();
        incident.setTitle(dto.getTitle());
        incident.setDescription(dto.getDescription());
        incident.setImageUrl(dto.getImageUrl());
        incident.setLocation(dto.getLocation());
        incident.setLatitude(dto.getLatitude());
        incident.setLongitude(dto.getLongitude());
        if (dto.getCreatorId() != null) {
            userRepository.findById(dto.getCreatorId()).ifPresent(incident::setCreator);
        }
        return incident;
    }
}
