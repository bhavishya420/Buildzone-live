// src/lib/openaiService.js

/**
 * Utility to call our Vercel serverless API for OpenAI.
 * This avoids exposing the API key to the client.
 */

/**
 * Enhance product search queries using AI
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
            Extract key product terms from user queries.
            Focus on: material types (PVC, cement, steel, etc.), 
            measurements, quantities, and specifications.
            Return only the most relevant search terms separated by spaces. 
            Keep it concise.`,
          },
          { role: "user", content: query },
        ],
      }),
    });

    if (!res.ok) {
      console.error("API error:", res.statusText);
      return query; // fallback
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim() || query;
  } catch (err) {
    console.error("Error enhancing query:", err);
    return query; // fallback
  }
}

/**
 * Transcribe audio (calls backend API that uses Whisper via /api/openai)
 * @param {Blob} audioBlob
 * @param {string} language
 * @returns {Promise<string>}
 */
export async function transcribeAudio(audioBlob, language = "auto") {
  try {
    const formData = new FormData();
    formData.append("file", audioBlob);
    formData.append("language", language);

    const res = await fetch("/api/openai?task=transcribe", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error(`API error: ${res.statusText}`);

    const data = await res.json();
    return data?.text || "";
  } catch (err) {
    console.error("Error transcribing audio:", err);
    return "";
  }
}

/**
 * Quick check: is OpenAI endpoint responding
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
