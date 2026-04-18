import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are Care Compass, a compassionate mental health support companion.
You are not a therapist and do not diagnose.
You listen, validate, and offer gentle support.

Always acknowledge what the user has shared before offering any perspective or encouragement.
Ask a follow-up question if more context would help.
Be warm and non-judgmental, but keep your tone measured and professional.
If you sense significant distress, remind the user that real support is available.`;

export async function patientAgent(
    conversationHistory: { role: string; content: string }[],
    userMessage: string
): Promise<string> {
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: SYSTEM_PROMPT,
        generationConfig: { temperature: 0.7 },
    });

    // Build chat history from prior turns. Exclude current message.
    const history = conversationHistory.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
    }));

    try {
        const chat = model.startChat({ history });
        const result = await chat.sendMessage(userMessage);
        return result.response.text();
    } catch (err) {
        console.error('patientAgent error:', err);
        throw new ApiError('The chat service is temporarily unavailable. Please try again in a moment.');
    }
}

export class ApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ApiError';
    }
}
