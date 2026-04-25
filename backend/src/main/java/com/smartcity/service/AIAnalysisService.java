package com.smartcity.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class AIAnalysisService {

    public Map<String, Object> analyzeIncident(String description) {
        Map<String, Object> analysis = new HashMap<>();
        String desc = description.toLowerCase();

        int score = 50; // Default
        String type = "Other";
        String action = "Investigate and assign to appropriate department";
        String urgency = "Moyen";

        if (desc.contains("fire") || desc.contains("incendie") || desc.contains("feu")) {
            score = 95;
            type = "Fire";
            urgency = "Très urgent";
            action = "Call firefighters immediately";
        } else if (desc.contains("accident") || desc.contains("crash") || desc.contains("blood")
                || desc.contains("injury")) {
            score = 92;
            type = "Accident";
            urgency = "Très urgent";
            action = "Dispatch ambulance and police";
        } else if (desc.contains("flood") || desc.contains("leak") || desc.contains("water")) {
            score = 75;
            type = "Infrastructure";
            urgency = "Très urgent";
            action = "Alert water department and civil protection";
        } else if (desc.contains("trash") || desc.contains("garbage") || desc.contains("déchet")) {
            score = 25;
            type = "Trash";
            urgency = "Simple";
            action = "Notify cleaning service for pickup";
        } else if (desc.contains("light") || desc.contains("pothole") || desc.contains("broken")) {
            score = 45;
            type = "Infrastructure";
            urgency = "Moyen";
            action = "Schedule repair with public works";
        }

        analysis.put("urgencyScore", score);
        analysis.put("urgency", urgency);
        analysis.put("type", type);
        analysis.put("suggestedAction", action);

        // Assistant Message Generation
        String assistantMsg = "Report is being processed. ";
        if (score >= 90) {
            assistantMsg += "This incident requires immediate intervention! Highly critical.";
        } else if (score >= 40) {
            assistantMsg += "System recommends prioritizing this for next available agent.";
        } else {
            assistantMsg += "Low priority incident. Can be handled during routine maintenance.";
        }

        analysis.put("assistantMessage", assistantMsg);
        analysis.put("suggestedStatus", (score > 70) ? "IN_PROGRESS" : "PENDING");

        return analysis;
    }
}
