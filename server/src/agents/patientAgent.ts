import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are Care Compass, a compassionate mental health support companion.
You are not a therapist and do not diagnose.

Keep your replies short — 2 to 3 sentences maximum.
Acknowledge what the user shared and validate their feeling in one warm sentence.
Do not ask follow-up questions. Do not offer advice or coping strategies unless the user asks.
Do not list resources — a separate system handles that.
Be warm, gentle, and human. Never clinical or formal.`;

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
        console.log('[patientAgent] Sending message to Gemini...');
        const result = await chat.sendMessage(userMessage);
        console.log('[patientAgent] Raw response:', JSON.stringify(result.response, null, 2));
        const text = result.response.text();
        console.log('[patientAgent] Response text:', text);
        return text;
    } catch (err: any) {
        console.error('[patientAgent] Full error object:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
        console.error('[patientAgent] Error message:', err?.message);
        console.error('[patientAgent] Error status:', err?.status ?? err?.httpStatus ?? err?.code);
        console.error('[patientAgent] Error stack:', err?.stack);
        const status  = err?.status  ?? err?.httpStatus ?? err?.code;
        const message = err?.message ?? '';
        if (status === 429 || message.includes('429') || message.toLowerCase().includes('quota') || message.toLowerCase().includes('rate')) {
            throw new ApiError('The AI service is currently rate-limited. Please wait a moment and try again.');
        }
        if (status === 403 || message.includes('403') || message.toLowerCase().includes('api key') || message.toLowerCase().includes('permission')) {
            throw new ApiError('The AI service is misconfigured (invalid or missing API key). Please contact support.');
        }
        if (status === 503 || message.toLowerCase().includes('unavailable') || message.toLowerCase().includes('overloaded')) {
            throw new ApiError('The AI service is temporarily overloaded. Please try again in a moment.');
        }
        throw new ApiError(`The AI service encountered an unexpected error${message ? ': ' + message : '. Please try again.'}`);
    }
}

export class ApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ApiError';
    }
}
