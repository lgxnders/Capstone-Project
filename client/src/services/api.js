//const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const API_BASE = "http://127.0.0.1:8000/api";

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