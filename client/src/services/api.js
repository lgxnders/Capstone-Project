const BASE_URL = "http://127.0.0.1:8000";
const API_BASE = `${BASE_URL}/api`;
const AUTH_BASE = `${BASE_URL}/api/auth`;

export async function sendChatMessage(message, conversationId = null) {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("NOT_LOGGED_IN");

    const res = await fetch(`${API_BASE}/chat/message`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ message, conversationId }),
    });


    const data = await res.json();
    console.log("API response:", data);

    if (res.status === 401) throw new Error("UNAUTHORIZED");
    if (!res.ok) throw new Error(data?.error ?? "SERVER_ERROR");

    return {
        reply:             data.reply,
        conversationId:    data.conversationId,
        resourceIntro:     data.resourceIntro,
        resources:         data.resources,
        internalResources: data.internalResources,
        suggestedPrompts:  data.suggestedPrompts,
    };
}

export async function fetchAllResources() {
    const res = await fetch(`${API_BASE}/resources`);

    if (!res.ok) throw new Error("Failed to fetch resources");

    const data = await res.json();
    return data.resources;
}

export async function fetchRandomResource() {
    const res = await fetch(`${API_BASE}/resources/random`);

    if (!res.ok) throw new Error("Failed to fetch random resource");

    const data = await res.json();
    return data.resource;
}


export async function fetchResourceById(id) {
    const res = await fetch(`${API_BASE}/resources/${id}`);

    if (!res.ok) throw new Error("Failed to fetch resource");

    const data = await res.json();
    return data.resource;
}

export async function login(email, password) {
    const res = await fetch(`${AUTH_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    return { ok: res.ok, data };
}

export async function register(formData) {
    const res = await fetch(`${AUTH_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });

    const data = await res.json();
    return { ok: res.ok, data };
}

export async function createResource(resourceData) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("NOT_LOGGED_IN");

    console.log('Sending resource data:', resourceData);

    const res = await fetch(`${API_BASE}/resources`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(resourceData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error ?? "Failed to create resource");
    return data.resource;
}

export async function updateResource(id, resourceData) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("NOT_LOGGED_IN");

    const res = await fetch(`${API_BASE}/resources/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(resourceData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error ?? "Failed to update resource");
    return data.resource;
}

export async function deleteResource(id) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("NOT_LOGGED_IN");

    const res = await fetch(`${API_BASE}/resources/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "Failed to delete resource");
    }
    return true;
}