import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Mic, Play, Pause, Square } from 'lucide-react';
import { supabaseService } from '../../services/supabaseService';

const VoiceRecordingModal = ({ isOpen, onClose, onTranscriptionReceived }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const chunksRef = useRef([]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (mediaRecorderRef?.current && mediaRecorderRef?.current?.state !== 'inactive') {
      mediaRecorderRef?.current?.stop();
    }
    if (audioContextRef?.current) {
      audioContextRef?.current?.close();
    }
    setIsRecording(false);
    setIsPlaying(false);
    setAudioBlob(null);
    setTranscription('');
    setError('');
    setSearchResults([]);
    chunksRef.current = [];
  }, []);

  // Close modal and cleanup
  const handleClose = useCallback(() => {
    cleanup();
    onClose();
  }, [cleanup, onClose]);

  // Initialize audio recording
  const startRecording = async () => {
    try {
      setError('');
      
      const stream = await navigator.mediaDevices?.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 1
        } 
      });

      // Create audio context for better handling
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' :'audio/webm'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event?.data?.size > 0) {
          chunksRef?.current?.push(event?.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { 
          type: mediaRecorder.mimeType || 'audio/webm' 
        });
        setAudioBlob(audioBlob);
        
        // Stop all tracks to free up microphone
        stream?.getTracks()?.forEach(track => track?.stop());
      };

      mediaRecorder?.start(100); // Collect data every 100ms
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Failed to access microphone. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef?.current && mediaRecorderRef?.current?.state === 'recording') {
      mediaRecorderRef?.current?.stop();
      setIsRecording(false);
    }
  };

  const playAudio = () => {
    if (audioBlob && audioRef?.current) {
      if (isPlaying) {
        audioRef?.current?.pause();
        setIsPlaying(false);
      } else {
        const audioUrl = URL.createObjectURL(audioBlob);
        audioRef.current.src = audioUrl;
        audioRef?.current?.play();
        setIsPlaying(true);
        
        audioRef.current.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
      }
    }
  };

  const transcribeAudio = async () => {
    if (!audioBlob) return;

    setIsTranscribing(true);
    setError('');

    try {
      const formData = new FormData();
      formData?.append('file', audioBlob, 'audio.webm');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response?.ok) {
        const errorData = await response?.json();
        throw new Error(errorData.error || 'Transcription failed');
      }

      const result = await response?.json();
      setTranscription(result?.text);
      
      // Automatically search for products
      if (result?.text) {
        await searchProducts(result?.text);
      }
    } catch (error) {
      console.error('Transcription error:', error);
      setError(error?.message || 'Failed to transcribe audio');
    } finally {
      setIsTranscribing(false);
    }
  };

  const searchProducts = async (query) => {
    if (!query?.trim()) return;

    setIsSearching(true);
    try {
      const products = await supabaseService?.getProducts();
      
      // Simple fuzzy search
      const searchTerms = query?.toLowerCase()?.split(' ');
      const filtered = products?.filter(product => {
        const productText = `${product?.name} ${product?.category} ${product?.brand || ''}`?.toLowerCase();
        return searchTerms?.some(term => productText?.includes(term));
      });

      // Sort by relevance (count matching terms)
      const sorted = filtered?.map(product => {
          const productText = `${product?.name} ${product?.category} ${product?.brand || ''}`?.toLowerCase();
          const matchCount = searchTerms?.filter(term => productText?.includes(term))?.length;
          return { ...product, matchCount };
        })?.sort((a, b) => b?.matchCount - a?.matchCount)?.slice(0, 3); // Top 3 results

      setSearchResults(sorted);
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search products');
    } finally {
      setIsSearching(false);
    }
  };

  const confirmTranscription = () => {
    if (transcription && onTranscriptionReceived) {
      onTranscriptionReceived({
        text: transcription,
        searchResults: searchResults
      });
    }
    handleClose();
  };

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Voice Search</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Recording Controls */}
        <div className="flex items-center justify-center space-x-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center justify-center w-16 h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
              disabled={isTranscribing}
            >
              <Mic className="w-8 h-8" />
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center justify-center w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors animate-pulse"
            >
              <Square className="w-8 h-8" />
            </button>
          )}

          {/* Play/Pause Button */}
          {audioBlob && (
            <button
              onClick={playAudio}
              className="flex items-center justify-center w-12 h-12 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-colors"
              disabled={isTranscribing}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
          )}
        </div>

        {/* Recording Status */}
        <div className="text-center">
          {isRecording && (
            <p className="text-red-600 font-medium">Recording... Tap square to stop</p>
          )}
          {audioBlob && !isRecording && !transcription && (
            <p className="text-gray-600">Recording complete. Transcribe to search products.</p>
          )}
        </div>

        {/* Transcribe Button */}
        {audioBlob && !transcription && (
          <div className="flex justify-center">
            <button
              onClick={transcribeAudio}
              disabled={isTranscribing}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isTranscribing ? 'Transcribing...' : 'Transcribe Audio'}
            </button>
          </div>
        )}

        {/* Transcription Result */}
        {transcription && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transcription:
              </label>
              <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-800">
                "{transcription}"
              </div>
            </div>

            {/* Search Results */}
            {isSearching ? (
              <div className="text-center text-gray-600">Searching products...</div>
            ) : searchResults?.length > 0 ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Found Products:
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {searchResults?.map((product) => (
                    <div
                      key={product?.id}
                      className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <div className="font-medium text-blue-900">{product?.name}</div>
                      <div className="text-sm text-blue-600">
                        {product?.category} • ₹{product?.price}
                        {product?.brand && ` • ${product?.brand}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 text-sm">
                No matching products found
              </div>
            )}

            {/* Confirm Button */}
            <div className="flex space-x-3">
              <button
                onClick={() => setTranscription('')}
                className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Record Again
              </button>
              <button
                onClick={confirmTranscription}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        )}

        {/* Hidden audio element */}
        <audio ref={audioRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default VoiceRecordingModal;