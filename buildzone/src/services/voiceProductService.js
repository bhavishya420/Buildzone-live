import { supabase } from '../lib/supabase';
import { transcribeAudio, enhanceSearchQuery } from './openaiService';

/**
 * Voice recording utilities for Web Audio API
 */
export class VoiceRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
  }

  /**
   * Start recording audio from microphone
   */
  async startRecording() {
    try {
      // Request microphone access
      this.stream = await navigator?.mediaDevices?.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      // Create MediaRecorder instance
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.audioChunks = [];

      // Collect audio data
      this.mediaRecorder.ondataavailable = (event) => {
        if (event?.data?.size > 0) {
          this.audioChunks?.push(event?.data);
        }
      };

      // Start recording
      this.mediaRecorder?.start(100); // Collect data every 100ms

      return true;
    } catch (error) {
      console.error('Error starting voice recording:', error);
      throw new Error('Failed to access microphone. Please check permissions.');
    }
  }

  /**
   * Stop recording and return audio blob
   */
  async stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state !== 'recording') {
        reject(new Error('Recording is not active'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        // Create audio blob from chunks
        const audioBlob = new Blob(this.audioChunks, { 
          type: 'audio/webm;codecs=opus' 
        });
        
        // Clean up
        this.cleanup();
        
        resolve(audioBlob);
      };

      // Stop recording
      this.mediaRecorder.stop();
    });
  }

  /**
   * Clean up resources
   */
  cleanup() {
    if (this.stream) {
      this.stream?.getTracks()?.forEach(track => track?.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  /**
   * Check if recording is active
   */
  isRecording() {
    return this.mediaRecorder?.state === 'recording';
  }
}

/**
 * Fallback search function when AI is not available
 * @param {string} searchText - Raw search text
 * @returns {Promise<Array>} Array of matching products
 */
async function fallbackProductSearch(searchText) {
  try {
    console.log('Using fallback search without AI enhancement');
    
    // Basic text processing for search terms
    const searchTerms = searchText
      ?.toLowerCase()
      ?.replace(/[^\w\s]/g, '') // Remove special characters
      ?.split(/\s+/)
      ?.filter(term => term?.length > 2)
      ?.slice(0, 5); // Limit to 5 terms

    if (!searchTerms?.length) {
      throw new Error('No valid search terms found');
    }

    // Build basic search query
    let query = supabase
      ?.from('products')
      ?.select('*')
      ?.gt('stock', 0);

    // Create OR conditions for product name, brand, and description matching
    const orConditions = [];
    searchTerms?.forEach(term => {
      orConditions?.push(`name.ilike.%${term}%`);
      orConditions?.push(`brand.ilike.%${term}%`);
      orConditions?.push(`description.ilike.%${term}%`);
    });

    if (orConditions?.length > 0) {
      query = query?.or(orConditions?.join(','));
    }

    const { data: products, error } = await query?.limit(5);

    if (error) {
      console.error('Error in fallback search:', error);
      throw new Error('Failed to search products');
    }

    return products || [];
  } catch (error) {
    console.error('Error in fallback product search:', error);
    throw error;
  }
}

/**
 * Search products in Supabase based on voice transcription
 * @param {string} transcriptionText - Text from voice transcription
 * @returns {Promise<Array>} Array of matching products
 */
export async function searchProductsByVoice(transcriptionText) {
  try {
    let searchQuery = transcriptionText;
    
    // Try to enhance search query with AI first
    try {
      searchQuery = await enhanceSearchQuery(transcriptionText);
      console.log('AI-enhanced search query:', searchQuery);
    } catch (aiError) {
      console.log('AI enhancement failed, using original text:', aiError?.message);
      // Continue with original text
    }
    
    // Split enhanced query into search terms
    const searchTerms = searchQuery?.toLowerCase()?.split(' ')?.filter(term => term?.length > 2);
    
    if (!searchTerms?.length) {
      throw new Error('No valid search terms found');
    }

    // Build search query using ILIKE for pattern matching
    let query = supabase
      ?.from('products')
      ?.select('*')
      ?.gt('stock', 0); // Only show products in stock

    // Create OR conditions for product name and brand matching
    const orConditions = searchTerms
      ?.map(term => `name.ilike.%${term}%,brand.ilike.%${term}%,description.ilike.%${term}%`)
      ?.join(',');

    if (orConditions) {
      query = query?.or(orConditions);
    }

    // Execute query with limit
    const { data: products, error } = await query?.limit(5);

    if (error) {
      console.error('Error searching products:', error);
      throw new Error('Failed to search products');
    }

    return products || [];
  } catch (error) {
    console.error('Error in voice product search:', error);
    throw error;
  }
}

/**
 * Process voice input with AI transcription (primary method)
 * @param {Blob} audioBlob - Audio blob from recording
 * @returns {Promise<Object>} Object containing transcription and products
 */
async function processVoiceWithAI(audioBlob) {
  // Step 1: Transcribe audio to text using AI
  const transcriptionText = await transcribeAudio(audioBlob, 'auto');
  
  if (!transcriptionText?.trim()) {
    throw new Error('No speech detected in audio');
  }

  // Step 2: Search for products
  const products = await searchProductsByVoice(transcriptionText);

  return {
    transcription: transcriptionText,
    products: products,
    method: 'ai',
    success: true
  };
}

/**
 * Process voice input with fallback method (when AI is unavailable)
 * @param {Blob} audioBlob - Audio blob from recording
 * @returns {Promise<Object>} Object containing fallback response
 */
async function processVoiceWithFallback(audioBlob) {
  console.log('AI transcription unavailable, using fallback method');
  
  // For demo purposes, provide a manual input option
  return {
    transcription: '',
    products: [],
    method: 'fallback',
    requiresManualInput: true,
    message: 'AI transcription is temporarily unavailable. Please type your search manually.',
    success: false
  };
}

/**
 * Process voice input end-to-end with fallback handling
 * @param {Blob} audioBlob - Audio blob from recording
 * @returns {Promise<Object>} Object containing transcription and products
 */
export async function processVoiceInput(audioBlob) {
  try {
    // First attempt: Try AI transcription
    try {
      return await processVoiceWithAI(audioBlob);
    } catch (error) {
      console.error('AI processing failed:', error?.message);
      
      // Check if it's a quota/API error
      if (error?.message?.includes('quota exceeded') || 
          error?.message?.includes('API key') ||
          error?.message?.includes('temporarily unavailable')) {
        
        // Use fallback method for quota errors
        return await processVoiceWithFallback(audioBlob);
      }
      
      // Re-throw other errors (like no speech detected)
      throw error;
    }
  } catch (error) {
    console.error('Error processing voice input:', error);
    throw error;
  }
}

/**
 * Process manual text input when voice processing fails
 * @param {string} textInput - Manual text input from user
 * @returns {Promise<Object>} Object containing search results
 */
export async function processManualTextInput(textInput) {
  try {
    if (!textInput?.trim()) {
      throw new Error('Please enter a search query');
    }

    // Search products using fallback method
    const products = await fallbackProductSearch(textInput);

    return {
      transcription: textInput,
      products: products,
      method: 'manual',
      success: true
    };
  } catch (error) {
    console.error('Error processing manual input:', error);
    throw error;
  }
}

/**
 * Voice Intent Recognition System
 */
export class VoiceIntentProcessor {
  constructor() {
    // Common intent patterns
    this.intentPatterns = {
      search: [
        'खोज', 'search', 'find', 'देखो', 'चाहिए', 'want', 'need',
        'मिल', 'available', 'उपलब्ध'
      ],
      quantity: [
        'कितना', 'how much', 'price', 'cost', 'दाम', 'rate', 'रेट',
        'amount', 'quantity', 'मात्रा'
      ],
      purchase: [
        'खरीद', 'buy', 'purchase', 'order', 'ऑर्डर', 'cart', 'कार्ट',
        'add', 'जोड़', 'लें', 'take'
      ]
    };
  }

  /**
   * Determine user intent from transcribed text
   * @param {string} text - Transcribed text
   * @returns {Object} Intent analysis result
   */
  analyzeIntent(text) {
    const lowerText = text?.toLowerCase() || '';
    const detectedIntents = [];

    // Check each intent pattern
    Object?.entries(this.intentPatterns)?.forEach(([intent, patterns]) => {
      const matchCount = patterns?.filter(pattern => 
        lowerText?.includes(pattern?.toLowerCase())
      )?.length;

      if (matchCount > 0) {
        detectedIntents?.push({
          intent,
          confidence: matchCount / patterns?.length,
          matchCount
        });
      }
    });

    // Sort by confidence
    detectedIntents?.sort((a, b) => b?.confidence - a?.confidence);

    return {
      primaryIntent: detectedIntents?.[0]?.intent || 'search',
      confidence: detectedIntents?.[0]?.confidence || 0.1,
      allIntents: detectedIntents,
      originalText: text
    };
  }

  /**
   * Extract entities from text (quantities, products, etc.)
   * @param {string} text - Input text
   * @returns {Object} Extracted entities
   */
  extractEntities(text) {
    const entities = {
      quantities: [],
      products: [],
      units: []
    };

    // Extract number patterns
    const numberPattern = /(\d+(?:\.\d+)?)\s*(bag|bags|बैग|piece|pieces|पीस|meter|meters|मीटर|kg|kgs|किलो|liter|liters|लीटर)/gi;
    const matches = text?.matchAll(numberPattern);

    for (const match of matches || []) {
      entities?.quantities?.push({
        amount: parseFloat(match?.[1]),
        unit: match?.[2]?.toLowerCase(),
        raw: match?.[0]
      });
    }

    return entities;
  }
}

// Export singleton instance
export const voiceIntentProcessor = new VoiceIntentProcessor();