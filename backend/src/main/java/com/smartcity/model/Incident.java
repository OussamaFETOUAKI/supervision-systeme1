package com.smartcity.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing an urban incident report.
 * Maps to the 'incidents' table in the database.
 */
@Entity
@Table(name = "incidents")
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Title of the incident (e.g., "Fire on Main Street")
    @Column(nullable = false)
    private String title;

    // Detailed description provided by the citizen
    @Column(nullable = false, length = 1000)
    private String description;

    // URL of the incident image or Base64 data
    @Lob
    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    // Current status: PENDING, IN_PROGRESS, RESOLVED
    @Column(nullable = false)
    private String status;

    // Urgency level assigned by AI: Très urgent, Moyen, Simple
    private String urgency;

    // Type of incident detected by AI: Fire, Accident, Trash, Other
    private String type;

    // Location: city or area name (textual)
    private String location;

    // GPS Coordinates
    private Double latitude;
    private Double longitude;

    // Suggested action from AI analysis
    private String suggestedAction;

    private Integer urgencyScore; // 0 to 100
    private String assistantMessage;

    // Timestamp when the incident was created
    @Column(nullable = false)
    private LocalDateTime createdAt;

    // The user who reported this incident
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User creator;

    // ---- Constructors ----

    public Incident() {
        this.status = "PENDING";
        this.createdAt = LocalDateTime.now();
    }

    // ---- Getters and Setters ----

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getSuggestedAction() {
        return suggestedAction;
    }

    public void setSuggestedAction(String suggestedAction) {
        this.suggestedAction = suggestedAction;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public Integer getUrgencyScore() {
        return urgencyScore;
    }

    public void setUrgencyScore(Integer urgencyScore) {
        this.urgencyScore = urgencyScore;
    }

    public String getAssistantMessage() {
        return assistantMessage;
    }

    public void setAssistantMessage(String assistantMessage) {
        this.assistantMessage = assistantMessage;
    }
}
