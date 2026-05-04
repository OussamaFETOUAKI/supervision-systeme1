package com.smartcity.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class GeminiAIService {

    @Value("${ai.gemini.secret}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, String> analyzeIncident(String description, String imageBase64) {
        try {
            String prompt = "Analyze this urban incident. Description: " + description +
                    ". Return ONLY a JSON object with keys: type (fire, accident, trash, infrastructure), " +
                    "urgency (Simple, Moyen, Très urgent), urgencyScore (an integer from 0 to 100 representing exact severity, 100 being catastrophic), action (suggested solution for administration), " +
                    "and reporterSuggestion (What the reporter should do right now, e.g. 'Call 15 for Moroccan ambulance/firefighters', 'Call 19 for Moroccan police', 'Call 150 for civil protection'). " +
                    "CRITICAL: Detect the language used in the Description (e.g., French, Arabic, English, Darija) and write the 'action' and 'reporterSuggestion' in that EXACT language.";

            Map<String, Object> requestBody = createGeminiRequest(prompt, imageBase64);
            String response = restTemplate.postForObject(apiUrl + "?key=" + apiKey, requestBody, String.class);

            return parseGeminiResponse(response);
        } catch (Exception e) {
            System.err.println("Gemini API Error: " + e.getMessage());
            return getFallbackAnalysis(description);
        }
    }

    private Map<String, Object> createGeminiRequest(String prompt, String imageBase64) {
        List<Map<String, Object>> parts = new ArrayList<>();
        parts.add(Map.of("text", prompt));

        if (imageBase64 != null && imageBase64.contains(",")) {
            String cleanBase64 = imageBase64.split(",")[1];
            parts.add(Map.of("inline_data", Map.of(
                    "mime_type", "image/jpeg",
                    "data", cleanBase64)));
        }

        return Map.of("contents", List.of(Map.of("parts", parts)));
    }

    private Map<String, String> parseGeminiResponse(String response) {
        try {
            JsonNode root = objectMapper.readTree(response);
            String text = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

            // Clean markdown if AI returns it
            String jsonText = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
            JsonNode result = objectMapper.readTree(jsonText);

            Map<String, String> analysis = new HashMap<>();
            analysis.put("type", result.path("type").asText("infrastructure"));
            analysis.put("urgency", result.path("urgency").asText("Moyen"));
            analysis.put("urgencyScore", result.path("urgencyScore").asText("50"));
            analysis.put("action", result.path("action").asText("Conduct inspection."));
            analysis.put("reporterSuggestion", result.path("reporterSuggestion").asText("No immediate action needed."));
            return analysis;
        } catch (Exception e) {
            return getFallbackAnalysis("");
        }
    }

    private Map<String, String> getFallbackAnalysis(String description) {
        Map<String, String> fallback = new HashMap<>();
        String desc = (description != null ? description.toLowerCase() : "");

        if (desc.contains("fire") || desc.contains("smoke")) {
            fallback.put("type", "fire");
            fallback.put("urgency", "Très urgent");
            fallback.put("urgencyScore", "95");
            fallback.put("action", "Dispatch fire department immediately.");
            fallback.put("reporterSuggestion", "Call 15 immediately for the Moroccan fire department and stay away from the area.");
        } else if (desc.contains("trash") || desc.contains("waste")) {
            fallback.put("type", "trash");
            fallback.put("urgency", "Simple");
            fallback.put("urgencyScore", "20");
            fallback.put("action", "Schedule waste collection.");
            fallback.put("reporterSuggestion", "Thank you for reporting. No further action is required from you.");
        } else {
            fallback.put("type", "infrastructure");
            fallback.put("urgency", "Moyen");
            fallback.put("urgencyScore", "50");
            fallback.put("action", "Review for maintenance queue.");
            fallback.put("reporterSuggestion", "Your report has been logged. Please avoid the area if it poses a danger.");
        }
        return fallback;
    }
}
