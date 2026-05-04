# 🏙️ Smart City Incident Supervision System

A modern incident supervision system for smart cities — built as an academic project.

## 🧱 Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Backend    | Java Spring Boot 3.2          |
| Database   | H2 (in-memory, demo)         |
| Frontend   | Next.js 15 + Tailwind CSS    |
| API        | RESTful JSON                  |

---

## 📁 Project Structure

```
Supervision System/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/smartcity/
│   │   ├── controller/         # REST API endpoints
│   │   ├── service/            # Business logic + AI analysis
│   │   ├── repository/         # Data access layer (JPA)
│   │   ├── model/              # Entity classes
│   │   ├── dto/                # Data Transfer Objects
│   │   └── config/             # CORS + sample data
│   └── pom.xml                 # Maven dependencies
│
└── frontend/                   # Next.js application
    ├── app/
    │   ├── page.tsx            # Citizen Portal
    │   └── admin/page.tsx      # Admin Dashboard
    ├── components/
    │   └── Navbar.tsx          # Navigation bar
    └── lib/
        └── api.ts              # API utility functions
```

---

## 🚀 How to Run

### 1. Backend (Spring Boot)

**Prerequisites:** Java 17+, Maven

```bash
cd backend
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**

- H2 Console: http://localhost:8080/h2-console
- API Base: http://localhost:8080/api/incidents

### 2. Frontend (Next.js)

**Prerequisites:** Node.js 18+

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on **http://localhost:3000**

---

## 🔗 API Endpoints

| Method | Endpoint                       | Description              |
|--------|--------------------------------|--------------------------|
| POST   | /api/incidents                 | Create new incident      |
| GET    | /api/incidents                 | Get all incidents        |
| GET    | /api/incidents?status=PENDING  | Filter by status         |
| GET    | /api/incidents/{id}            | Get incident by ID       |
| PATCH  | /api/incidents/{id}/status     | Update incident status   |
| GET    | /api/incidents/stats           | Get dashboard statistics |

---

## 🤖 AI Simulation

The system uses keyword detection in incident descriptions:

| Keyword     | Urgency       | Action                              |
|-------------|---------------|--------------------------------------|
| fire, feu   | Très urgent   | Call firefighters immediately        |
| accident    | Très urgent   | Send ambulance and police            |
| flood       | Très urgent   | Alert civil protection               |
| trash       | Simple        | Schedule cleanup                     |
| pothole     | Moyen         | Notify public works                  |
| (default)   | Moyen         | Investigate and assign               |

---

## ✨ Features

- ✅ Citizen incident reporting with form
- ✅ AI-powered urgency classification
- ✅ Admin dashboard with statistics
- ✅ Status management (Pending → In Progress → Resolved)
- ✅ Filtering by status and urgency
- ✅ Location tracking
- ✅ Urgent incident notifications
- ✅ Status progression timeline
- ✅ Modern glassmorphism UI design
- ✅ Responsive layout

---

## 👨‍🎓 Academic Project

Built for Smart City course demonstration.
Architecture: Clean MVC (Controller → Service → Repository)
"# Supervision-System" 
