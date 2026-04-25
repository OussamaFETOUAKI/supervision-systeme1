package com.smartcity.config;

import com.smartcity.model.Incident;
import com.smartcity.service.IncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

        @Autowired
        private IncidentService incidentService;

        @Override
        public void run(String... args) {
                if (incidentService.getTotalCount() > 0) {
                        System.out.println("📦 Database already has data. Skipping sample loading.");
                        return;
                }
                System.out.println("📦 Loading sample incidents for demo...");

                incidentService.createIncident(create("Fire in warehouse district",
                                "Large fire spotted in the abandoned warehouse on Industrial Avenue.",
                                "https://images.unsplash.com/photo-1486551937199-baf066858de7?w=400",
                                "Industrial District"));
                incidentService.createIncident(create("Car accident on Highway 7",
                                "Multi-car accident blocking both lanes. Possible injuries reported.",
                                "https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=400",
                                "Highway 7 - Exit 4"));
                incidentService.createIncident(create("Illegal trash dumping",
                                "Large amounts of trash and garbage dumped near the park entrance.",
                                "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400",
                                "Central Park Area"));
                incidentService.createIncident(
                                create("Broken street light", "Street light on Oak Road has been broken for a week.",
                                                "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400",
                                                "Oak Road - Block 3"));

                System.out.println("✅ Sample data loaded successfully!");
        }

        private Incident create(String t, String d, String img, String l) {
                Incident i = new Incident();
                i.setTitle(t);
                i.setDescription(d);
                i.setImageUrl(img);
                i.setLocation(l);
                return i;
        }
}
