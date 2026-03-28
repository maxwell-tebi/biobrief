const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const PROMPT = `
You are a medical lab result interpreter helping patients in Ghana understand their results.

Analyze the lab result provided and respond ONLY with valid JSON in this exact format:
{
  "english": {
    "summary": "A well formatted plain-language overview of what these results mean overall.",
    "flagged": ["List each abnormal value with a brief plain-language explanation of what it means"],
    "normal": ["List each normal value briefly"]
  },
  "twi": {
    "summary": "The english summary translated into Twi (Akan language)",
    "flagged": ["Each item in the english flagged array translated into Twi, in the same order"],
    "normal": ["Each item in the english normal array translated into Twi, in the same order"]
  },
  "diet": {
    "english": {
      "recommended": ["2-4 specific foods to eat more of, relevant to Ghanaian diet where possible"],
      "limit": ["2-3 specific foods or drinks to reduce or avoid"],
      "tip": "One practical pro tip related to the flagged values"
    },
    "twi": {
      "recommended": ["Each recommended item translated into Twi, same order"],
      "limit": ["Each limit item translated into Twi, same order"],
      "tip": "The pro tip translated into Twi"
    }
  }
}

Important rules:
- Use plain language — no medical jargon
- Never diagnose or prescribe medication
- If a value is borderline, mention it in flagged with context
- If no values are flagged, say so clearly in the summary
- Always end with a note to consult a healthcare professional
`;

async function analyzeLabResult({ imageBuffer, mimeType, text }) {
  const parts = [{ text: PROMPT }];

  if (imageBuffer) {
    // Vision input: pass image as inline base64 data
    parts.push({
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: mimeType || "image/jpeg",
      },
    });
  } else if (text) {
    // Text input: append the raw text
    parts.push({ text: `Lab result text:\n${text}` });
  } else {
    throw new Error("No input provided — supply an image or text.");
  }

  const result = await model.generateContent(parts);
  const raw = result.response.text();

  return parseResponse(raw);
}

function parseResponse(raw) {
  try {
    // Gemini sometimes wraps JSON in markdown code fences — strip them
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    // Fallback: return raw text under english.summary so the UI still shows something
    return {
      english: {
        summary: raw,
        flagged: [],
        normal: [],
      },
      twi: { summary: "", flagged: [], normal: [] },
      diet: { english: { recommended: [], limit: [], tip: "" }, twi: { recommended: [], limit: [], tip: "" } },
    };
  }
}

const SYMPTOM_PROMPT = `
You are a medical assistant helping patients in Ghana understand how their lab results relate to their symptoms.

The patient has these flagged lab values:
{FLAGGED}

They report these symptoms:
{SYMPTOMS}

Respond ONLY with valid JSON in this exact format:
{
  "connection": "2-3 sentences in plain language explaining how the symptoms may relate to the flagged values. Be empathetic.",
  "recommendation": "1-2 practical next steps — when to seek care, what to watch for. Never prescribe.",
  "twi": {
    "connection": "The connection translated into Twi (Akan language)",
    "recommendation": "The recommendation translated into Twi"
  }
}

Rules:
- Never diagnose or prescribe medication
- If symptoms don't relate to the flagged values, say so gently and still advise seeing a doctor
- Always end with a recommendation to consult a healthcare professional
`;

async function analyzeSymptoms({ symptoms, flagged }) {
  const prompt = SYMPTOM_PROMPT
    .replace("{FLAGGED}", flagged.join("\n"))
    .replace("{SYMPTOMS}", symptoms);

  const result = await model.generateContent([{ text: prompt }]);
  const raw = result.response.text();
  return parseResponse(raw);
}

module.exports = { analyzeLabResult, analyzeSymptoms };
