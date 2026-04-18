import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are a clinical content safety discriminator for a mental health support application.
Your only job is to determine whether a user message requires IMMEDIATE crisis intervention.

Only flag a message if it contains ACTIVE, PRESENT-TENSE indicators of imminent danger, such as:
- Expressing a current desire or intent to end their life or harm themselves RIGHT NOW (e.g. "I want to kill myself", "I'm going to hurt myself tonight")
- An active, immediate threat to harm another person
- A disclosure of abuse or danger that is happening right now and requires urgent intervention

Do NOT flag messages that:
- Discuss mental health topics generally (e.g. "I've been feeling depressed")
- Describe a past history of crisis or self-harm (e.g. "I used to self-harm", "I had suicidal thoughts last year")
- Mention a diagnosis or condition (e.g. "I have schizophrenia", "I struggle with anxiety")
- Express sadness, hopelessness, or distress without immediate intent to act (e.g. "I feel like things will never get better")
- Ask about mental health topics out of curiosity or concern for others

The distinction is IMMEDIACY and INTENT. A user reflecting on their past or describing their condition is not a crisis — they deserve a compassionate conversation, not a crisis line. Only intervene when there is a clear and present danger.

Respond ONLY with valid JSON. No markdown, no explanation, nothing outside the JSON.

If no immediate crisis:  { "flagged": false }
If immediate crisis:     { "flagged": true, "category": "<category>", "reason": "<short reason>" }

Valid categories: "self-harm", "suicidal", "violence", "abuse", "crisis", "other"`;

export const CRISIS_RESPONSE = `What you're sharing is important, and I want to make sure you get the right support. Please consider reaching out to a crisis line — they are free, confidential, and available 24/7. Talk Suicide Canada: call or text 1-833-456-4566. Kids Help Phone (under 29): call 1-800-668-6868 or text CONNECT to 686868. Distress Centre Canada: 1-800-268-7253. You are not alone. 💙`;

export interface PsychologistResult {
    flagged: boolean;
    category?: string;
    reason?: string;
}

export async function psychologistAgent(userMessage: string): Promise<PsychologistResult> {
    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: SYSTEM_PROMPT,
            generationConfig: { temperature: 0 },
        });

        const result = await model.generateContent(userMessage);
        const text = result.response.text().trim();

        // Clean code fences from model prompt.
        const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/, '').trim();
        const parsed = JSON.parse(cleaned) as PsychologistResult;

        // Ensure required field is present and a boolean.
        if (typeof parsed.flagged !== 'boolean') {
            throw new Error('Invalid response shape: flagged field missing or not boolean');
        }

        return parsed;

    } catch (err) {
        // Fail open -- a classification error should not trigger a crisis response
        // for users simply describing anxiety, stress, or other non-crisis topics.
        console.error('psychologistAgent error (failing open):', err);
        return { flagged: false };
    }
}
