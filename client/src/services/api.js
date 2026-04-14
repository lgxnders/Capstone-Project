const BASE_URL = "http://127.0.0.1:8000";
const API_BASE = `${BASE_URL}/api`;
const AUTH_BASE = `${BASE_URL}/auth`;

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

    console.log("DEBUG: Received response data:")
    console.log(data)


    return { reply: data.reply, conversationId: data.conversationId };
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