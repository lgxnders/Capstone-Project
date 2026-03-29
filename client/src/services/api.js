//const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const API_BASE = "http://127.0.0.1:8000/api";

export async function sendChatMessage(message) {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("NOT_LOGGED_IN");

    const res = await fetch(`${API_BASE}/chat/message`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
    });
    

    const data = await res.json();

    console.log("Received token:")
    console.log(token)

    console.log("Received response data:")
    console.log(data)

    console.log("Received reply:")
    console.log(data.reply)

    return data.reply;
}
