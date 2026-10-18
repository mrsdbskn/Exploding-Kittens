import { RULEBOOKS, RULES_FAQS } from '../data/rulesKnowledge.js';

const STORAGE_KEY_API_KEY = 'ek_gemini_api_key';
const STORAGE_KEY_MODEL = 'ek_gemini_model';
export const DEFAULT_MODEL = 'gemini-flash-lite-latest';

export const SUPPORTED_GEMINI_MODELS = [
  { id: 'gemini-flash-lite-latest', name: 'Gemini Flash Lite (Ultra-Fast & Recommended ⚡)', description: 'Sub-second answers (<1s) for instant rulings' },
  { id: 'gemini-flash-latest', name: 'Gemini Flash (Balanced)', description: 'Detailed grounded rulings' },
  { id: 'gemini-pro-latest', name: 'Gemini Pro (Deep Reasoning)', description: 'Complex multi-card dispute analysis' }
];

// Auto-import API key from URL parameter if present (?gemini_key=... or ?gemini=...)
export function autoImportKeyFromUrl() {
  if (typeof window === 'undefined' || !window.location) return;
  try {
    const url = new URL(window.location.href);
    const keyParam = url.searchParams.get('gemini_key') ||
                     url.searchParams.get('geminiKey') ||
                     url.searchParams.get('gemini') ||
                     url.searchParams.get('apiKey');
    if (keyParam && keyParam.trim().length > 10) {
      setGeminiApiKey(keyParam.trim());
      url.searchParams.delete('gemini_key');
      url.searchParams.delete('geminiKey');
      url.searchParams.delete('gemini');
      url.searchParams.delete('apiKey');
      window.history.replaceState({}, '', url.toString());
    }
  } catch (e) {
    // Ignore URL parsing errors
  }
}

// Run auto-import immediately upon script evaluation
autoImportKeyFromUrl();

// Retrieve active API key (from localStorage or environment)
export function getGeminiApiKey() {
  try {
    autoImportKeyFromUrl();
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_API_KEY);
      if (saved && saved.trim()) return saved.trim();
    }
  } catch (e) {
    // localStorage might not be accessible in rare sandbox modes
  }
  return (import.meta.env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.VITE_GEMINI_API_KEY : '') || '').trim();
}

// Store API key
export function setGeminiApiKey(key) {
  try {
    if (typeof localStorage !== 'undefined') {
      if (key && key.trim()) {
        localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
      } else {
        localStorage.removeItem(STORAGE_KEY_API_KEY);
      }
    }
  } catch (e) {
    console.error('Failed to save API key to localStorage', e);
  }
}

// Retrieve selected model
export function getGeminiModel() {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_MODEL);
      if (saved && saved.trim()) return saved.trim();
    }
  } catch (e) {}
  return DEFAULT_MODEL;
}

// Store selected model
export function setGeminiModel(model) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_MODEL, model || DEFAULT_MODEL);
    }
  } catch (e) {}
}

export function isGeminiConfigured() {
  const key = getGeminiApiKey();
  return Boolean(key && key.length > 10);
}

// Build compact official rules knowledge base grounding for system instruction
function buildGroundingContext() {
  let context = 'OFFICIAL EXPLODING KITTENS CORE RULES & MECHANICS GROUNDING:\n\n';

  // Core rulebook summaries
  for (const rb of RULEBOOKS) {
    context += `=== ${rb.title} ===\n`;
    for (const sec of rb.sections.slice(0, 4)) {
      context += `[${sec.title}]: ${sec.content}\n`;
    }
    context += '\n';
  }

  // Key FAQs
  context += '=== ESSENTIAL CARD RULES & TIMING FAQS ===\n';
  for (const faq of RULES_FAQS.slice(0, 15)) {
    context += `Q: ${faq.question}\nA: ${faq.answer}\nRef: ${faq.reference}\n\n`;
  }

  return context;
}

const GROUNDING_CONTEXT = buildGroundingContext();

function getSystemInstruction(lang = 'en') {
  return `You are the official "Kitten Rules Referee" (Kätzchen-Schiedsrichter) for the card game Exploding Kittens.
Your mission is to provide 100% accurate, authoritative, and unambiguous rulings on card interactions, turn timing, expansion mechanics, combos, and edge cases.

${GROUNDING_CONTEXT}

CRITICAL RULES INVARIANTS:
1. Defuse cards and Exploding Kittens can NEVER be Noped.
2. A Nope CAN cancel another Nope (creating a "Yup!" / "Doch!").
3. If a player holding Streaking Kitten has their Exploding Kitten stolen by another player (e.g. via Favor or Cat combo), the STEALER explodes immediately.
4. Barking Kitten cannot be Noped.
5. Attack cards stack turns: if an attacked player plays an Attack card, their remaining turns plus the new attack turns pass to the next target.
6. Cat Combos: 2 matching cards steal 1 random card; 3 matching cards demand a specific named card (must surrender 1 if held); 5 different cards retrieve any 1 card of choice from the discard pile.
7. Imploding Kitten: When drawn face-down, it is inserted back face-up anywhere in the draw pile. When drawn face-up, it causes immediate explosion and CANNOT be defused by any card.
8. Godcat (Good vs. Evil): Can be played as any card in the game EXCEPT a Nope.
9. Zombie Kittens: Dead players keep cards in hand and can only play cards with the Zombie icon (or Attack of the Dead, Feed the Dead, Grave Robber).
10. Tone & Style: Friendly, witty, slightly playful feline referee (occasional "Meow!" / "Miau!"), but strictly concise, clear, and direct on the actual rules verdict. Use bullet points and bold highlights for readability.
11. Language: Answer in German if asked in German (or if language is set to 'de'); answer in English otherwise. Always cite the relevant official rulebook or card when possible.`;
}

/**
 * Validate an API key by making a lightweight test query.
 */
export async function testGeminiApiKey(apiKey, model = DEFAULT_MODEL) {
  if (!apiKey || !apiKey.trim()) {
    return { ok: false, error: 'No API key provided.' };
  }

  const modelPath = model.startsWith('models/') ? model : `models/${model}`;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent?key=${apiKey.trim()}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: 'Respond with exactly: OK' }] }
        ],
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.1,
          thinkingConfig: { thinkingBudget: 0 }
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg = errData?.error?.message || `HTTP ${response.status} ${response.statusText}`;
      return { ok: false, error: msg };
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidateText) {
      return { ok: true, message: `Connected to ${model} successfully!` };
    }
    return { ok: false, error: 'No content received from Gemini.' };
  } catch (err) {
    return { ok: false, error: err.message || 'Network error connecting to Google API.' };
  }
}

/**
 * Send a chat turn to Gemini with full grounding and conversational history.
 */
export async function queryGeminiRules(userQuery, chatHistory = [], lang = 'en') {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key is not configured.');
  }

  const model = getGeminiModel();
  const modelPath = model.startsWith('models/') ? model : `models/${model}`;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent?key=${apiKey}`;

  // Convert previous messages to Gemini format (limit to last 8 turns to conserve context)
  const contents = [];
  const recentHistory = chatHistory.slice(-8);

  for (const msg of recentHistory) {
    if (msg.sender === 'user') {
      contents.push({ role: 'user', parts: [{ text: msg.text }] });
    } else if (msg.sender === 'bot') {
      contents.push({ role: 'model', parts: [{ text: msg.text }] });
    }
  }

  // Append current query
  contents.push({ role: 'user', parts: [{ text: userQuery }] });

  const payload = {
    system_instruction: {
      parts: [{ text: getSystemInstruction(lang) }]
    },
    contents,
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1500,
      thinkingConfig: { thinkingBudget: 0 }
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    const errorMsg = errorJson?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(errorMsg);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('No answer generated by Gemini.');
  }

  // Detect any related card slugs mentioned in the text for interactive preview buttons
  const potentialCards = [
    'nope', 'defuse', 'exploding-kitten', 'imploding-kitten', 'streaking-kitten',
    'barking-kitten', 'godcat', 'devilcat', 'armageddon', 'catomic-bomb',
    'alter-the-future-3x', 'see-the-future-3x', 'attack-2x', 'targeted-attack-2x',
    'attack-of-the-dead', 'favor', 'zombie-kitten', 'clairvoyance', 'feral-cat',
    'tower-of-power', 'curse-of-the-cat-butt'
  ];

  const lowerText = text.toLowerCase();
  const relatedCards = potentialCards.filter(slug => {
    const readable = slug.replace(/-/g, ' ');
    return lowerText.includes(slug) || lowerText.includes(readable);
  }).slice(0, 3);

  return {
    answer: text,
    reference: lang === "de" ? `Gemini AI (${model}) • Offizielle Regelbücher Grounding` : `Gemini AI (${model}) • Grounded in Official Rulebooks`,
    relatedCards,
    isGemini: true,
    modelUsed: model
  };
}
