import OpenAI from 'openai';

/**
 * Initializes the OpenAI client with the API key from environment variables.
 */
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage
});

// Retry configuration for API calls
const RETRY_CONFIG = {
  maxRetries: 2,
  baseDelay: 1000, // 1 second
  maxDelay: 5000   // 5 seconds
};

/**
 * Utility function to implement exponential backoff retry
 */
async function retryWithBackoff(fn, retries = RETRY_CONFIG?.maxRetries) {
  try {
    return await fn();
  } catch (error) {
    // Don't retry quota exceeded errors - they won't resolve quickly
    if (error?.status === 429 || retries <= 0) {
      throw error;
    }

    const delay = Math.min(
      RETRY_CONFIG?.baseDelay * Math.pow(2, RETRY_CONFIG?.maxRetries - retries),
      RETRY_CONFIG?.maxDelay
    );
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1);
  }
}

/**
 * Transcribes an audio file to text using OpenAI Whisper.
 * @param {Blob} audioBlob - The audio blob to transcribe.
 * @param {string} language - Language hint for transcription (optional).
 * @returns {Promise<string>} The transcribed text.
 */
export async function transcribeAudio(audioBlob, language = 'auto') {
  try {
    // Convert blob to File object for OpenAI API
    const audioFile = new File([audioBlob], 'audio.webm', {
      type: audioBlob.type || 'audio/webm'
    });

    const transcribeFunction = async () => {
      const response = await openai?.audio?.transcriptions?.create({
        file: audioFile,
        model: 'whisper-1',
        language: language === 'auto' ? undefined : language,
        response_format: 'json',
      });
      return response?.text;
    };

    return await retryWithBackoff(transcribeFunction);
  } catch (error) {
    console.error('Error transcribing audio:', error);
    
    // Handle specific error types with more detailed messages
    if (error?.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your configuration.');
    } else if (error?.status === 429) {
      throw new Error('OpenAI API quota exceeded. Please try again later or upgrade your plan.');
    } else if (error?.status === 413) {
      throw new Error('Audio file too large. Maximum file size is 25MB.');
    } else if (error?.status === 422) {
      throw new Error('Audio format not supported. Please try again with a different recording.');
    } else if (error?.status >= 500) {
      throw new Error('OpenAI service is temporarily unavailable. Please try again in a few minutes.');
    } else {
      throw new Error('Failed to transcribe audio. Please try again.');
    }
  }
}

/**
 * Searches products using OpenAI to interpret and enhance search queries.
 * @param {string} query - The search query from voice transcription.
 * @returns {Promise<string>} Enhanced search terms for product matching.
 */
export async function enhanceSearchQuery(query) {
  try {
    const enhanceFunction = async () => {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a construction materials search assistant. Extract key product terms from user queries.
            Focus on: material types (PVC, cement, steel, etc.), measurements, quantities, and specifications.
            Return only the most relevant search terms separated by spaces. Keep it concise.
            
            Examples:
            "आधा इंच पीवीसी पाइप 50 पीस" → "PVC pipe 1/2 inch" "10 बैग सीमेंट चाहिए"→ "cement bags" "स्टील रॉड 12mm" → "steel rod 12mm"`
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.3,
        max_tokens: 50,
      });
      return response?.choices?.[0]?.message?.content?.trim() || query;
    };

    return await retryWithBackoff(enhanceFunction);
  } catch (error) {
    console.error('Error enhancing search query:', error);
    
    // For search enhancement, gracefully fallback to original query
    // This allows the app to continue working even if AI enhancement fails
    console.log('Falling back to basic search without AI enhancement');
    return query;
  }
}

/**
 * Check if OpenAI API is available and working
 * @returns {Promise<boolean>} True if API is available
 */
export async function checkOpenAIAvailability() {
  try {
    // Simple test call to check API availability
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 1,
    });
    return true;
  } catch (error) {
    console.error('OpenAI API not available:', error);
    return false;
  }
}

export default openai;