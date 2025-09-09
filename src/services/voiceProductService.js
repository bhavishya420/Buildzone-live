// src/services/voiceProductService.js
// Voice product helpers: transcription -> search using Supabase.
// Uses the server-side proxied OpenAI endpoints via src/lib/openaiService.js
// DO NOT import the 'openai' npm package from client-side code.

import { supabase } from "../lib/supabase";
import { transcribeAudio, enhanceSearchQuery } from "../lib/openaiService";

/**
 * VoiceRecorder - Web Audio API helper to record audio in webm/opus
 */
export class VoiceRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
  }

  async startRecording() {
    try {
      this.stream = await navigator?.mediaDevices?.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event?.data?.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100);
      return true;
    } catch (error) {
      console.error("Error starting voice recording:", error);
      throw new Error("Failed to access microphone. Please check permissions.");
    }
  }

  async stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state !== "recording") {
        reject(new Error("Recording is not active"));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, {
          type: "audio/webm;codecs=opus",
        });
        this.cleanup();
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  cleanup() {
    if (this.stream) {
      this.stream.getTracks()?.forEach((t) => t.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  isRecording() {
    return this.mediaRecorder?.state === "recording";
  }
}

/**
 * Basic fallback product search (no AI) using Supabase ILIKE queries.
 * Returns up to 5 products.
 */
async function fallbackProductSearch(searchText) {
  try {
    console.log("Using fallback search without AI enhancement");

    const searchTerms = searchText
      ?.toLowerCase()
      ?.replace(/[^\w\s]/g, "")
      ?.split(/\s+/)
      ?.filter((term) => term?.length > 2)
      ?.slice(0, 5);

    if (!searchTerms?.length) return [];

    let query = supabase.from("products").select("*").gt("stock", 0);

    const orConditions = [];
    searchTerms.forEach((term) => {
      orConditions.push(`name.ilike.%${term}%`);
      orConditions.push(`brand.ilike.%${term}%`);
      orConditions.push(`description.ilike.%${term}%`);
    });

    if (orConditions.length > 0) {
      query = query.or(orConditions.join(","));
    }

    const { data: products, error } = await query.limit(5);

    if (error) {
      console.error("Error in fallback search:", error);
      throw error;
    }

    return products || [];
  } catch (error) {
    console.error("Error in fallbackProductSearch:", error);
    throw error;
  }
}

/**
 * Uses AI-enhanced terms (if available) to search Supabase products.
 * Returns up to 5 products.
 */
export async function searchProductsByVoice(transcriptionText) {
  try {
    let searchQuery = transcriptionText;

    // Try AI enhancement (calls /api/openai via src/lib/openaiService)
    try {
      const enhanced = await enhanceSearchQuery(transcriptionText);
      if (enhanced && enhanced.trim().length > 0) searchQuery = enhanced;
      console.log("AI-enhanced search query:", searchQuery);
    } catch (aiError) {
      console.warn("AI enhancement failed, using original text:", aiError?.message);
    }

    const searchTerms = searchQuery
      ?.toLowerCase()
      ?.split(/\s+/)
      ?.filter((term) => term?.length > 2);

    if (!searchTerms?.length) return [];

    let query = supabase.from("products").select("*").gt("stock", 0);

    const orConditions = searchTerms
      .map((term) => `name.ilike.%${term}%,brand.ilike.%${term}%,description.ilike.%${term}%`)
      .join(",");

    if (orConditions) query = query.or(orConditions);

    const { data: products, error } = await query.limit(5);

    if (error) {
      console.error("Error searching products:", error);
      // If Supabase fails, fallback to simple search
      return await fallbackProductSearch(transcriptionText);
    }

    return products || [];
  } catch (error) {
    console.error("Error in searchProductsByVoice:", error);
    // final fallback
    return await fallbackProductSearch(transcriptionText);
  }
}

/**
 * Process voice input using AI transcription + product search.
 * Returns { transcription, products, method, success }
 */
async function processVoiceWithAI(audioBlob) {
  const transcriptionText = await transcribeAudio(audioBlob, "auto");

  if (!transcriptionText?.trim()) {
    throw new Error("No speech detected in audio");
  }

  const products = await searchProductsByVoice(transcriptionText);

  return {
    transcription: transcriptionText,
    products,
    method: "ai",
    success: true,
  };
}

/**
 * Fallback behavior when AI extraction isn't available / fails.
 */
async function processVoiceWithFallback(audioBlob) {
  console.log("AI transcription unavailable, using fallback method");

  // For demo: return manual-input hint; actual UI should show text input.
  return {
    transcription: "",
    products: [],
    method: "fallback",
    requiresManualInput: true,
    message: "AI transcription is temporarily unavailable. Please type your search manually.",
    success: false,
  };
}

/**
 * End-to-end voice processing with graceful fallback.
 */
export async function processVoiceInput(audioBlob) {
  try {
    try {
      return await processVoiceWithAI(audioBlob);
    } catch (error) {
      console.error("AI processing failed:", error?.message);

      // For quota / API-key / service errors, use fallback
      const msg = (error?.message || "").toLowerCase();
      if (msg.includes("quota") || msg.includes("api key") || msg.includes("temporarily unavailable")) {
        return await processVoiceWithFallback(audioBlob);
      }

      // otherwise re-throw
      throw error;
    }
  } catch (error) {
    console.error("Error processing voice input:", error);
    throw error;
  }
}

/**
 * Manual text input fallback
 */
export async function processManualTextInput(textInput) {
  if (!textInput?.trim()) {
    throw new Error("Please enter a search query");
  }

  const products = await fallbackProductSearch(textInput);

  return {
    transcription: textInput,
    products,
    method: "manual",
    success: true,
  };
}

/**
 * Simple voice-intent recognizer for demo: extracts intent and some entities.
 */
export class VoiceIntentProcessor {
  constructor() {
    this.intentPatterns = {
      search: ["खोज", "search", "find", "चाहिए", "want", "need", "available"],
      quantity: ["कितना", "how much", "price", "cost", "मात्रा", "quantity"],
      purchase: ["खरीद", "buy", "order", "cart", "add", "ऑर्डर"],
    };
  }

  analyzeIntent(text) {
    const lowerText = text?.toLowerCase() || "";
    const detectedIntents = [];

    Object.entries(this.intentPatterns).forEach(([intent, patterns]) => {
      const matchCount = patterns.filter((p) => lowerText.includes(p.toLowerCase())).length;
      if (matchCount > 0) {
        detectedIntents.push({ intent, confidence: matchCount / patterns.length, matchCount });
      }
    });

    detectedIntents.sort((a, b) => b.confidence - a.confidence);

    return {
      primaryIntent: detectedIntents[0]?.intent || "search",
      confidence: detectedIntents[0]?.confidence || 0.1,
      allIntents: detectedIntents,
      originalText: text,
    };
  }

  extractEntities(text) {
    const entities = { quantities: [], products: [], units: [] };
    const numberPattern = /(\d+(?:\.\d+)?)\s*(bag|bags|बैग|piece|pieces|पीस|meter|meters|मीटर|kg|kgs|किलो|liter|liters|लीटर)/gi;

    const matches = text?.matchAll?.(numberPattern) || [];
    for (const match of matches) {
      entities.quantities.push({ amount: parseFloat(match[1]), unit: match[2].toLowerCase(), raw: match[0] });
    }

    return entities;
  }
}

export const voiceIntentProcessor = new VoiceIntentProcessor();
