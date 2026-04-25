package com.smartcity.dto;

/**
 * DTO for updating the status of an incident.
 * Used by the admin to change status: PENDING → IN_PROGRESS → RESOLVED
 */
public class StatusUpdateDTO {

    private String status;

    public StatusUpdateDTO() {
    }

    public StatusUpdateDTO(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
