import OpenAI from 'openai';
import formidable from 'formidable';
import fs from 'fs';

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY
});

// ElevenLabs STT endpoint (if using ElevenLabs instead)
const ELEVENLABS_STT_URL = 'https://api.elevenlabs.io/v1/speech-to-text';

export default async function handler(req, res) {
  // Set CORS headers
  res?.setHeader('Access-Control-Allow-Credentials', true);
  res?.setHeader('Access-Control-Allow-Origin', '*');
  res?.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res?.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req?.method === 'OPTIONS') {
    res?.status(200)?.end();
    return;
  }

  if (req?.method !== 'POST') {
    return res?.status(405)?.json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    // Parse multipart form data
    const form = formidable({
      maxFileSize: 25 * 1024 * 1024, // 25MB limit
      keepExtensions: true
    });

    const [fields, files] = await form?.parse(req);
    const audioFile = files?.file?.[0];

    if (!audioFile) {
      return res?.status(400)?.json({ 
        error: 'No audio file provided. Please upload an audio file.' 
      });
    }

    // Check if file exists and is readable
    if (!fs?.existsSync(audioFile?.filepath)) {
      return res?.status(400)?.json({ 
        error: 'Audio file not found or corrupted.' 
      });
    }

    // Determine STT provider
    const sttProvider = process.env?.STT_PROVIDER || 'whisper';
    let transcription;

    if (sttProvider === 'elevenlabs' && process.env?.ELEVENLABS_API_KEY) {
      // Use ElevenLabs STT
      transcription = await transcribeWithElevenLabs(audioFile);
    } else {
      // Use OpenAI Whisper (default)
      transcription = await transcribeWithWhisper(audioFile);
    }

    // Clean up temporary file
    try {
      fs?.unlinkSync(audioFile?.filepath);
    } catch (cleanupError) {
      console.warn('Could not clean up temp file:', cleanupError?.message);
    }

    return res?.status(200)?.json({ 
      text: transcription,
      provider: sttProvider 
    });

  } catch (error) {
    console.error('Transcription error:', error);
    
    // Handle specific error types
    if (error?.status === 401) {
      return res?.status(401)?.json({ 
        error: 'Invalid API key. Please check your configuration.' 
      });
    } else if (error?.status === 429) {
      return res?.status(429)?.json({ 
        error: 'API quota exceeded. Please try again later.' 
      });
    } else if (error?.status === 413) {
      return res?.status(413)?.json({ 
        error: 'Audio file too large. Maximum size is 25MB.' 
      });
    } else if (error?.status === 422) {
      return res?.status(422)?.json({ 
        error: 'Audio format not supported. Please try a different format.' 
      });
    }

    return res?.status(500)?.json({ 
      error: 'Transcription failed. Please try again.',
      details: process.env?.NODE_ENV === 'development' ? error?.message : undefined
    });
  }
}

async function transcribeWithWhisper(audioFile) {
  try {
    const audioStream = fs?.createReadStream(audioFile?.filepath);
    
    const response = await openai?.audio?.transcriptions?.create({
      file: audioStream,
      model: 'whisper-1',
      response_format: 'text',
      language: 'auto' // Auto-detect language
    });

    return response?.trim();
  } catch (error) {
    console.error('Whisper transcription error:', error);
    throw error;
  }
}

async function transcribeWithElevenLabs(audioFile) {
  try {
    const formData = new FormData();
    const audioBuffer = fs?.readFileSync(audioFile?.filepath);
    const audioBlob = new Blob([audioBuffer], { type: audioFile.mimetype });
    
    formData?.append('audio', audioBlob);
    formData?.append('model_id', 'eleven_multilingual_v2');

    const response = await fetch(ELEVENLABS_STT_URL, {
      method: 'POST',
      headers: {
        'xi-api-key': process.env?.ELEVENLABS_API_KEY
      },
      body: formData
    });

    if (!response?.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const result = await response?.json();
    return result?.text || '';
  } catch (error) {
    console.error('ElevenLabs transcription error:', error);
    throw error;
  }
}

// Configure to handle multipart form data
export const config = {
  api: {
    bodyParser: false
  }
};