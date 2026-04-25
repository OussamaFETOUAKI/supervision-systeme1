/**
 * API utility for communicating with the Spring Boot backend.
 */

const API_BASE = "http://localhost:8080/api/incidents";
const AUTH_BASE = "http://localhost:8080/api/auth";

export interface User {
    id: number;
    email: string;
    fullName: string;
    role: "ROLE_USER" | "ROLE_ADMIN";
    profilePicture?: string;
    bio?: string;
}

export interface Incident {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    status: string;
    urgency: string;
    urgencyScore: number;
    assistantMessage: string;
    type: string;
    location: string;
    latitude?: number;
    longitude?: number;
    suggestedAction: string;
    createdAt: string;
    creator?: User;
}

export interface CreateIncidentDTO {
    title: string;
    description: string;
    imageUrl: string;
    location: string;
    latitude?: number;
    longitude?: number;
    creatorId?: number;
}

/** AUTH METHODS **/

export async function loginUser(credentials: any): Promise<User> {
    const res = await fetch(`${AUTH_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error(await res.text() || "Login failed");
    return res.json();
}

export async function registerUser(userData: any): Promise<User> {
    const res = await fetch(`${AUTH_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error(await res.text() || "Registration failed");
    return res.json();
}

export async function updateUserProfile(id: number, data: any): Promise<User> {
    const res = await fetch(`${AUTH_BASE}/profile/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text() || "Update failed");
    return res.json();
}

/** INCIDENT METHODS **/

export async function fetchIncidents(status?: string, urgency?: string): Promise<Incident[]> {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (urgency) params.append("urgency", urgency);
    const url = params.toString() ? `${API_BASE}?${params}` : API_BASE;
    const res = await fetch(url, { cache: "no-store" });
    return res.json();
}

export async function fetchUserIncidents(userId: number): Promise<Incident[]> {
    const res = await fetch(`${API_BASE}/user/${userId}`, { cache: "no-store" });
    return res.json();
}

export async function createIncident(data: CreateIncidentDTO): Promise<Incident> {
    const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create incident");
    }
    return res.json();
}

export async function updateIncident(id: number, data: CreateIncidentDTO): Promise<Incident> {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function updateIncidentStatus(id: number, status: string): Promise<Incident> {
    const res = await fetch(`${API_BASE}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });
    return res.json();
}

export async function deleteIncident(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete incident");
}

export async function fetchStats(): Promise<{
    total: number;
    urgent: number;
    resolved: number;
    agents: number;
    responseTime: string;
    aiAccuracy: number;
}> {
    const res = await fetch(`${API_BASE}/stats`, { cache: "no-store" });
    return res.json();
}
