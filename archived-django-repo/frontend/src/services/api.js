const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export async function sendChatMessage(message) {
    const res = await fetch(`${API_BASE}/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
    });

    const data = await res.json();
    return data.reply;
    }
