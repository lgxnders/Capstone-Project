import type { PsychologistResult } from './psychologistAgent';
import { ResourceModel } from '../models/Resource';


export interface Resource {
    label:       string;
    url?:        string;
    phone?:      string;
    description: string;
    category:    ResourceCategory;
}

export type ResourceCategory =
    | 'crisis'
    | 'anxiety'
    | 'depression'
    | 'grief'
    | 'relationships'
    | 'stress'
    | 'violence'
    | 'abuse'
    | 'general';

export type DagInput = {
    userMessage:        string;
    patientReply:       string; // Reserved for future sentiment-based routing.
    conversationHistory: { role: string; content: string }[];
    psychologistResult: PsychologistResult;
};

export type DagOutput = {
    suggestResources:   boolean;
    resources:          Resource[];          // Hardcoded crisis/external resources. Present in flagged path only.
    internalResources:  InternalResource[];  // DB resources present in topic path only.
    suggestedPrompts:   string[];
    resourceIntro:      string;              // Natural-language intro sentence to show before the resource list.
};

export interface InternalResource {
    title:       string;
    url:         string;
    description: string;
    type:        string;
}


// Some hardcoded resources might change.
const RESOURCES: Record<ResourceCategory, Resource[]> = {
    crisis: [
        {
            label:       'Talk Suicide Canada',
            phone:       '1-833-456-4566',
            description: 'Free, confidential 24/7 suicide prevention support by phone; text 45645 (4 PM – midnight ET).',
            category:    'crisis',
        },
        {
            label:       'Crisis Services Canada',
            phone:       '1-833-456-4566',
            url:         'https://www.crisisservicescanada.ca',
            description: 'National network of crisis centres offering 24/7 bilingual support.',
            category:    'crisis',
        },
        {
            label:       'Kids Help Phone',
            phone:       '1-800-668-6868',
            url:         'https://kidshelpphone.ca',
            description: 'Free 24/7 counselling for young people up to age 29; text CONNECT to 686868.',
            category:    'crisis',
        },
    ],
    violence: [
        {
            label:       'Assaulted Women\'s Helpline',
            phone:       '1-866-863-0511',
            url:         'https://www.awhl.org',
            description: '24/7 crisis support for women who have experienced abuse or violence (Canada).',
            category:    'violence',
        },
        {
            label:       'Crisis Services Canada',
            phone:       '1-833-456-4566',
            url:         'https://www.crisisservicescanada.ca',
            description: 'National 24/7 crisis line for anyone in distress (Canada).',
            category:    'violence',
        },
    ],
    abuse: [
        {
            label:       'Assaulted Women\'s Helpline',
            phone:       '1-866-863-0511',
            url:         'https://www.awhl.org',
            description: '24/7 confidential crisis support and safety planning for abuse survivors (Canada).',
            category:    'abuse',
        },
        {
            label:       'Canadian Centre for Child Protection',
            phone:       '1-800-543-3986',
            url:         'https://www.protectchildren.ca',
            description: 'Support and resources for child abuse prevention and survivor support (Canada).',
            category:    'abuse',
        },
        {
            label:       'Sexual Assault Centre — SACE',
            url:         'https://sace.ca',
            description: 'Support services for survivors of sexual violence across Canada.',
            category:    'abuse',
        },
    ],
    anxiety: [
        {
            label:       'Anxiety Canada',
            url:         'https://www.anxietycanada.com',
            description: 'Free evidence-based resources, self-help tools, and the MindShift CBT app.',
            category:    'anxiety',
        },
        {
            label:       'Headspace',
            url:         'https://www.headspace.com',
            description: 'Guided meditations and breathing exercises to help manage anxiety and stress.',
            category:    'anxiety',
        },
        {
            label:       'Here to Help BC',
            url:         'https://www.heretohelp.bc.ca',
            description: 'Mental health and substance use resources from BC\'s leading non-profit agencies.',
            category:    'anxiety',
        },
    ],
    depression: [
        {
            label:       'Centre for Addiction and Mental Health (CAMH)',
            url:         'https://www.camh.ca/en/health-info/mental-illness-and-addiction-index/depression',
            description: 'Trusted information and treatment resources for depression from Canada\'s top mental health hospital.',
            category:    'depression',
        },
        {
            label:       'MoodGym',
            url:         'https://moodgym.com.au',
            description: 'Online cognitive behavioural therapy program for depression and anxiety.',
            category:    'depression',
        },
        {
            label:       'Kids Help Phone',
            phone:       '1-800-668-6868',
            url:         'https://kidshelpphone.ca',
            description: 'Free 24/7 counselling for young people up to age 29 (Canada).',
            category:    'depression',
        },
    ],
    grief: [
        {
            label:       'Canadian Virtual Hospice',
            url:         'https://www.virtualhospice.ca',
            description: 'Grief support, resources, and online community for those coping with loss (Canada).',
            category:    'grief',
        },
        {
            label:       'Bereaved Families of Ontario',
            url:         'https://www.bfo.ca',
            phone:       '1-800-236-6364',
            description: 'Peer support and grief groups for families who have lost a loved one (Ontario, Canada).',
            category:    'grief',
        },
    ],
    relationships: [
        {
            label:       'Psychology Today Canada — Therapist Finder',
            url:         'https://www.psychologytoday.com/ca/therapists',
            description: 'Find a licensed therapist or counsellor in Canada specialising in relationship issues.',
            category:    'relationships',
        },
        {
            label:       'Couple and Family Therapy — CAMFT Canada',
            url:         'https://www.camft.ca',
            description: 'Directory of certified marriage and family therapists across Canada.',
            category:    'relationships',
        },
    ],
    stress: [
        {
            label:       'Headspace',
            url:         'https://www.headspace.com',
            description: 'Guided meditations and mindfulness exercises to manage stress and burnout.',
            category:    'stress',
        },
        {
            label:       'Here to Help BC',
            url:         'https://www.heretohelp.bc.ca',
            description: 'Mental health and substance use resources and self-care tips (Canada).',
            category:    'stress',
        },
    ],
    general: [
        {
            label:       'Psychology Today Canada — Therapist Finder',
            url:         'https://www.psychologytoday.com/ca/therapists',
            description: 'Find a licensed therapist or counsellor near you in Canada.',
            category:    'general',
        },
        {
            label:       'Crisis Services Canada',
            phone:       '1-833-456-4566',
            url:         'https://www.crisisservicescanada.ca',
            description: 'National 24/7 bilingual crisis support line (Canada).',
            category:    'general',
        },
        {
            label:       'Hope for Wellness Help Line',
            phone:       '1-855-242-3310',
            description: 'Immediate mental health counselling for Indigenous peoples across Canada.',
            category:    'general',
        },
    ],
};


// Suggested prompts per 'leaf'.
const PROMPTS: { [key: string]: string[] | undefined } = {
    // Flagged leaves.
    'suicidal':    ["I've been having thoughts of hurting myself", "I don't know how to keep going right now"],
    'self-harm':   ["I've been having thoughts of hurting myself", "I don't know how to keep going right now"],
    'violence':    ["I'm feeling angry and I don't know what to do with it", "I'm worried about someone's safety"],
    'abuse':       ["I'm in a situation that doesn't feel safe", "I need help getting out of a harmful relationship"],
    'crisis':      ["I'm really struggling right now and need support", "I don't know how to keep going right now"],
    'other':       ["I'm really struggling right now and need support", "I don't know how to keep going right now"],

    // Non-flagged topic leaves.
    'anxiety':     ["I'm having problems with anxiety and panic attacks", "I feel overwhelmed and can't calm down"],
    'depression':  ["I'm having problems with feeling hopeless", "I've been really low and can't find motivation"],
    'grief':       ["I'm having problems coping with losing someone", "I don't know how to deal with this loss"],
    'relationships': ["I'm having problems with feeling alone", "I'm struggling with a relationship in my life"],
    'stress':      ["I'm having problems with stress at work", "I feel completely burned out and exhausted"],

    // Gentle nudge.
    'nudge':       ["I'd like to talk more about what I'm feeling"],
};


// Keyword map ordered by severity. Highest-descending order.
const KEYWORD_MAP: { topic: string; keywords: string[] }[] = [
    { topic: 'suicidal',       keywords: ['suicide', 'kill myself', 'end my life', "don't want to be here", 'better off dead'] },
    { topic: 'self-harm',      keywords: ['hurt myself', 'cutting', 'self-harm', 'self harm', 'burn myself'] },
    { topic: 'violence',       keywords: ['hurt someone', 'kill someone', 'want to hurt', 'angry enough to'] },
    { topic: 'abuse',          keywords: ['being abused', 'hitting me', 'afraid of', 'unsafe at home'] },
    { topic: 'anxiety',        keywords: ['anxious', 'anxiety', 'panic', 'panic attack', 'overwhelmed', "can't breathe", 'nervous', 'worried', 'worrying', 'on edge'] },
    { topic: 'depression',     keywords: ['depressed', 'depression', 'hopeless', 'numb', 'empty', "can't get out of bed", 'sad', 'feeling sad', 'feeling low', 'feeling down', 'no motivation', 'worthless'] },
    { topic: 'grief',          keywords: ['grief', 'grieving', 'lost someone', 'someone died', 'bereavement', 'death of'] },
    { topic: 'relationships',  keywords: ['lonely', 'alone', 'relationship', 'breakup', 'divorce', 'no one cares'] },
    { topic: 'stress',         keywords: ['stressed', 'stress', 'burnout', 'burned out', 'exhausted', 'overwhelmed at work'] },
];


function detectTopic(message: string): string | null {
    const lower = message.toLowerCase();
    for (const { topic, keywords } of KEYWORD_MAP) {
        if (keywords.some((kw) => lower.includes(kw))) {
            return topic;
        }
    }
    return null;
}


const RESOURCE_INTROS: Record<string, string> = {
    // Flagged / crisis paths.
    'suicidal':      "I'm sorry you're feeling this way. Please check out these resources:",
    'self-harm':     "I'm sorry you're going through this. Please check out these resources:",
    'violence':      "I'm sorry you're experiencing this. Please check out these resources:",
    'abuse':         "I'm sorry you're in this situation. Please check out these resources:",
    'crisis':        "I'm sorry you're having such a hard time. Please check out these resources:",
    'other':         "I'm sorry you're struggling right now. Please check out these resources:",

    // Topic paths.
    'anxiety':       "I'm sorry you're experiencing anxiety. Check out these resources:",
    'depression':    "I'm sorry you're feeling this way. Check out these resources:",
    'grief':         "I'm sorry for your loss. Check out these resources:",
    'relationships': "I'm sorry you're going through this. Check out these resources:",
    'stress':        "I'm sorry you're feeling so stressed. Check out these resources:",

    // Gentle nudge.
    'nudge':         "I'm glad you're talking about this. Here are some resources that may help:",
};


function getIntro(key: string): string {
    return RESOURCE_INTROS[key] ?? RESOURCE_INTROS['other'] ?? "You may be interested in these resources:";
}

function crisisLeaf(category: ResourceCategory, promptKey: string): DagOutput {
    return {
        suggestResources:  true,
        resources:         RESOURCES[category],
        internalResources: [],
        suggestedPrompts:  PROMPTS[promptKey] ?? [],
        resourceIntro:     getIntro(promptKey),
    };
}

function noResourceLeaf(): DagOutput {
    return { suggestResources: false, resources: [], internalResources: [], suggestedPrompts: [], resourceIntro: '' };
}


async function topicLeaf(topic: string, promptKey: string): Promise<DagOutput> {
    const docs = await ResourceModel
        .find(
            { $or: [{ topics: topic }, { tags: topic }, { targetStates: topic }] },
            { title: 1, url: 1, description: 1, type: 1, _id: 0 }
        )
        .limit(3)
        .lean();

    const internalResources: InternalResource[] = docs.map((d) => ({
        title:       d.title,
        url:         d.url,
        description: d.description,
        type:        d.type,
    }));

    const intro = getIntro(promptKey);

    // If the DB has results, use them as internal resources.
    if (internalResources.length > 0) {
        return {
            suggestResources:  true,
            resources:         [],
            internalResources,
            suggestedPrompts:  PROMPTS[promptKey] ?? [],
            resourceIntro:     intro,
        };
    }

    // Otherwise fall back to the hardcoded catalogue for this topic (if one exists).
    const category = topic as ResourceCategory;
    const fallbackResources: Resource[] = RESOURCES[category] ?? [];

    return {
        suggestResources:  fallbackResources.length > 0,
        resources:         fallbackResources,
        internalResources: [],
        suggestedPrompts:  PROMPTS[promptKey] ?? [],
        resourceIntro:     fallbackResources.length > 0 ? intro : '',
    };
}


// Traverses DAG.
export async function runResourceDag(input: DagInput): Promise<DagOutput> {
    const { userMessage, conversationHistory, psychologistResult } = input;

    // N1 - Is the psychologist flag raised?
    if (psychologistResult.flagged) {
        const category = psychologistResult.category ?? 'other';

        // N2 - Which flag category?
        switch (category) {
            case 'suicidal':
            case 'self-harm':
                return crisisLeaf('crisis', category);         // L1
            case 'violence':
                return crisisLeaf('violence', 'violence');     // L2
            case 'abuse':
                return crisisLeaf('abuse', 'abuse');           // L3
            case 'crisis':
            case 'other':
            default:
                return crisisLeaf('crisis', category);         // L4
        }
    }

    // N3 - Does the message mention a specific problem area?
    const topic = detectTopic(userMessage);

    if (topic !== null) {
        // N4 - Which topic? Query DB for internal resources.
        switch (topic) {
            case 'anxiety':       return topicLeaf('anxiety',       'anxiety');       // L5
            case 'depression':    return topicLeaf('depression',    'depression');    // L6
            case 'grief':         return topicLeaf('grief',         'grief');         // L7
            case 'relationships': return topicLeaf('relationships', 'relationships'); // L8
            case 'stress':        return topicLeaf('stress',        'stress');        // L9
            default:              return noResourceLeaf();                            // L10 -> L12
        }
    }

    // N5 - Has the conversation gone on for 3+ user turns?
    const userTurns = conversationHistory.filter((m) => m.role === 'user').length;
    if (userTurns >= 3) {
        // L11 - Gentle nudge with general external resources.
        return {
            suggestResources:  true,
            resources:         RESOURCES['general'],
            internalResources: [],
            suggestedPrompts:  PROMPTS['nudge'] ?? [],
            resourceIntro:     getIntro('nudge'),
        };
    }

    // L12 - No resource leaf.
    return noResourceLeaf();
}
