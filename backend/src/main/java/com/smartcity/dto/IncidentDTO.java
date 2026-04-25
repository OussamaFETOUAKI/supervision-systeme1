package com.smartcity.dto;

/**
 * DTO for creating a new incident.
 * Contains only the fields that a citizen provides.
 */
public class IncidentDTO {

    private String title;
    private String description;
    private String imageUrl; // Can be a URL or a Base64 string
    private String location;
    private Double latitude;
    private Double longitude;
    private Long creatorId;

    // ---- Constructors ----

    public IncidentDTO() {
    }

    public IncidentDTO(String title, String description, String imageUrl, String location) {
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.location = location;
    }

    public IncidentDTO(String title, String description, String imageUrl, String location, Double latitude,
            Double longitude) {
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // ---- Getters and Setters ----

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

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }
}
