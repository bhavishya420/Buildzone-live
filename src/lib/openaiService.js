// src/lib/openaiService.js
// Client-side helper that calls your serverless API at /api/openai
// - POST /api/openai with JSON { messages: [...] } for chat/completions
// - POST /api/openai?task=transcribe with FormData { file, language } for Whisper transcribe

/**
 * Enhance product search queries using AI (server-side OpenAI proxy).
 * @param {string} query
 * @returns {Promise<string>}
 */
export async function enhanceSearchQuery(query) {
  try {
    const res = await fetch("/api/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `You are a construction materials search assistant.
Extract key product terms from user queries. Focus on: material types (PVC, cement, steel, etc.),
measurements, quantities, and specifications. Return only the most relevant search terms separated by spaces.
Keep it concise.`,
          },
          { role: "user", content: query },
        ],
      }),
    });

    if (!res.ok) {
      console.error("Chat API error:", res.status, await res.text());
      return query; // fallback to original query
    }

    const data = await res.json();
    // Try to safely read response path used by Chat Completions
    return (
      data?.choices?.[0]?.message?.content?.trim() ||
      data?.choices?.[0]?.text?.trim() ||
      query
    );
  } catch (err) {
    console.error("Error enhancing query:", err);
    return query; // fallback
  }
}

/**
 * Transcribe audio via Whisper using serverless API (/api/openai?task=transcribe).
 * @param {Blob|File} audioBlob
 * @param {string} language
 * @returns {Promise<string>} transcription text
 */
export async function transcribeAudio(audioBlob, language = "auto") {
  try {
    const formData = new FormData();
    // If audioBlob is a File, keep its name; otherwise provide a default
    const file = audioBlob instanceof File ? audioBlob : new File([audioBlob], "audio.webm", { type: "audio/webm" });
    formData.append("file", file);
    formData.append("language", language);

    const res = await fetch("/api/openai?task=transcribe", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Transcription API error: ${res.status} ${text}`);
    }

    const data = await res.json();
    // Whisper typically returns { text: "..." }
    return data?.text || "";
  } catch (err) {
    console.error("Error transcribing audio:", err);
    return "";
  }
}

/**
 * Quick health check: is OpenAI proxy up?
 * @returns {Promise<boolean>}
 */
export async function checkOpenAIAvailability() {
  try {
    const res = await fetch("/api/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "ping" }],
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("OpenAI availability check failed:", err);
    return false;
  }
}
