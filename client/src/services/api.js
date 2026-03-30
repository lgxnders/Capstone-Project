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
