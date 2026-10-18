import { RULEBOOKS, RULES_FAQS } from '../data/rulesKnowledge.js';

const STORAGE_KEY_API_KEY = 'ek_gemini_api_key';
const STORAGE_KEY_MODEL = 'ek_gemini_model';
export const DEFAULT_MODEL = 'gemini-3.8-flash';
export const BACKUP_MODEL = 'gemini-3.5-flash-lite';

export const SUPPORTED_GEMINI_MODELS = [
  { 
    id: 'gemini-3.8-flash', 
    name: 'Gemini 3.8 Flash (High Intelligence • Auto-Backup ⚡)', 
    description: 'Top-tier reasoning (20 RPD free limit; automatically fails over to 3.5 Flash Lite when used up)' 
  },
  { 
    id: 'gemini-3.5-flash-lite', 
    name: 'Gemini 3.5 Flash Lite (High Quota • 1,500 RPD ⚡)', 
    description: 'Sub-second answers (<1s) with generous 1,500 requests/day free tier quota' 
  },
  { 
    id: 'gemini-flash-lite-latest', 
    name: 'Gemini Flash Lite (Latest)', 
    description: 'Fast, balanced lightweight model' 
  },
  { 
    id: 'gemini-flash-latest', 
    name: 'Gemini Flash (Balanced)', 
    description: 'Standard grounded rulings' 
  },
  { 
    id: 'gemini-pro-latest', 
    name: 'Gemini Pro (Deep Reasoning)', 
    description: 'Best for complex multi-card dispute analysis' 
  }
];

// Track models that recently hit quota limit (HTTP 429) to avoid latency on subsequent turns
const quotaExhaustedModels = new Map();

export function isModelQuotaExhausted(model) {
  const ts = quotaExhaustedModels.get(model);
  if (!ts) return false;
  // Cache for 15 minutes before re-checking primary
  if (Date.now() - ts > 15 * 60 * 1000) {
    quotaExhaustedModels.delete(model);
    return false;
  }
  return true;
}

export function markModelQuotaExhausted(model) {
  quotaExhaustedModels.set(model, Date.now());
}

/**
 * Build generationConfig tailored to each model.
 * Only models with thinking capability (e.g. gemini-3.8-flash) accept thinkingConfig.
 * Lite models (gemini-3.5-flash-lite, gemini-flash-lite-latest) reject thinkingConfig with 400 INVALID_ARGUMENT.
 */
function buildGenerationConfig(model, maxTokens = 1500) {
  const config = {
    temperature: 0.2,
    maxOutputTokens: maxTokens
  };
  const m = String(model).toLowerCase();
  if (m.includes('3.8') || m.includes('thinking')) {
    config.thinkingConfig = { thinkingBudget: 0 };
  }
  return config;
}

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
 * If the primary model returns 429 (quota exhausted), tests the backup model.
 */
export async function testGeminiApiKey(apiKey, model = DEFAULT_MODEL) {
  if (!apiKey || !apiKey.trim()) {
    return { ok: false, error: 'No API key provided.' };
  }

  const modelsToTest = [model];
  if (model !== BACKUP_MODEL) {
    modelsToTest.push(BACKUP_MODEL);
  }

  let quotaExhaustedOnPrimary = false;

  for (const m of modelsToTest) {
    const modelPath = m.startsWith('models/') ? m : `models/${m}`;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent?key=${apiKey.trim()}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: 'Respond with exactly: OK' }] }
          ],
          generationConfig: buildGenerationConfig(m, 20)
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          quotaExhaustedOnPrimary = true;
          markModelQuotaExhausted(m);
          continue; // Try backup model
        }
        const errData = await response.json().catch(() => ({}));
        const msg = errData?.error?.message || `HTTP ${response.status} ${response.statusText}`;
        return { ok: false, error: msg };
      }

      const data = await response.json();
      const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (candidateText) {
        if (quotaExhaustedOnPrimary) {
          return {
            ok: true,
            message: `Verbunden! (${model} hat sein 20-RPD-Tageslimit erreicht; automatisches Backup auf 3.5 Flash Lite ist aktiv ⚡)`
          };
        }
        return { ok: true, message: `Verbunden mit ${m} erfolgreich! ⚡` };
      }
    } catch (err) {
      return { ok: false, error: err.message || 'Netzwerkfehler zur Google API.' };
    }
  }

  return { ok: false, error: 'Alle Modelle haben ihr Kontingent (429 Quota) erreicht.' };
}

/**
 * Send a chat turn to Gemini with full grounding, history, and automatic quota failover.
 * If the primary model (e.g. 3.8 Flash) hits its 20 RPD quota limit (HTTP 429),
 * it seamlessly switches to 3.5 Flash Lite without disruption.
 */
export async function queryGeminiRules(userQuery, chatHistory = [], lang = 'en') {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key is not configured.');
  }

  const selectedModel = getGeminiModel();

  // Build candidate fallback list: [primary, backup1, backup2]
  const candidates = [selectedModel];
  if (selectedModel !== BACKUP_MODEL) {
    candidates.push(BACKUP_MODEL);
  }
  if (!candidates.includes('gemini-flash-lite-latest')) {
    candidates.push('gemini-flash-lite-latest');
  }

  // If primary model was recently marked 429 quota exhausted, promote backup to front
  if (isModelQuotaExhausted(selectedModel) && candidates.length > 1) {
    const primary = candidates.shift();
    candidates.push(primary);
  }

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

  let responseText = null;
  let activeModelUsed = selectedModel;
  let isBackupUsed = false;
  let lastError = null;

  for (const modelToTry of candidates) {
    try {
      const modelPath = modelToTry.startsWith('models/') ? modelToTry : `models/${modelToTry}`;
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent?key=${apiKey}`;

      const payload = {
        system_instruction: {
          parts: [{ text: getSystemInstruction(lang) }]
        },
        contents,
        generationConfig: buildGenerationConfig(modelToTry, 1500)
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        const status = response.status;
        const errorMsg = errorJson?.error?.message || `HTTP ${status}: ${response.statusText}`;

        // Quota exhausted (429) or temporary server error (503/500): switch to backup model
        if (status === 429 || status === 503 || status === 500) {
          if (status === 429) {
            markModelQuotaExhausted(modelToTry);
          }
          console.warn(`Gemini model ${modelToTry} quota/rate limit hit (${status}), automatically switching to backup model...`);
          lastError = new Error(errorMsg);
          continue; // Try next candidate in the chain!
        }

        // Fatal errors (e.g. invalid key)
        throw new Error(errorMsg);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        responseText = text;
        activeModelUsed = modelToTry;
        isBackupUsed = (modelToTry !== selectedModel);
        break; // Success!
      }
    } catch (err) {
      lastError = err;
      console.warn(`Query to model ${modelToTry} encountered error:`, err);
    }
  }

  if (!responseText) {
    throw lastError || new Error('No answer generated by Gemini.');
  }

  // Detect any related card slugs mentioned in the text for interactive preview buttons
  const potentialCards = [
    'nope', 'defuse', 'exploding-kitten', 'imploding-kitten', 'streaking-kitten',
    'barking-kitten', 'godcat', 'devilcat', 'armageddon', 'catomic-bomb',
    'alter-the-future-3x', 'see-the-future-3x', 'attack-2x', 'targeted-attack-2x',
    'attack-of-the-dead', 'favor', 'zombie-kitten', 'clairvoyance', 'feral-cat',
    'tower-of-power', 'curse-of-the-cat-butt'
  ];

  const lowerText = responseText.toLowerCase();
  const relatedCards = potentialCards.filter(slug => {
    const readable = slug.replace(/-/g, ' ');
    return lowerText.includes(slug) || lowerText.includes(readable);
  }).slice(0, 3);

  let refTag = `Gemini AI (${activeModelUsed})`;
  if (isBackupUsed) {
    refTag += lang === 'de' ? ' • Auto-Backup ⚡' : ' • Auto-Backup ⚡';
  }
  refTag += lang === 'de' ? ' • Offizielle Regelbücher Grounding' : ' • Grounded in Official Rulebooks';

  return {
    answer: responseText,
    reference: refTag,
    relatedCards,
    isGemini: true,
    modelUsed: activeModelUsed,
    isBackupUsed
  };
}
