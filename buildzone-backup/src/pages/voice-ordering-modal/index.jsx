import React, { useState, useRef, useEffect } from 'react';
import { X, Mic, MicOff, Loader2, CheckCircle2, ShoppingCart, Volume2, AlertTriangle, Edit3, Search } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../hooks/useCart';
import { supabase } from '../../lib/supabase';
import { VoiceRecorder, processVoiceInput, processManualTextInput } from '../../services/voiceProductService';
import toast from 'react-hot-toast';

const VoiceOrderingModal = ({ isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [foundProducts, setFoundProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [error, setError] = useState('');
  const [showFallback, setShowFallback] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [processingMethod, setProcessingMethod] = useState('');
  
  const { user } = useAuth();
  const { addToCart } = useCart();
  const voiceRecorderRef = useRef(null);

  // Initialize voice recorder
  useEffect(() => {
    if (isOpen) {
      voiceRecorderRef.current = new VoiceRecorder();
    }

    return () => {
      // Cleanup on unmount
      voiceRecorderRef?.current?.cleanup();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartListening = async () => {
    if (isListening || isProcessing) return;

    try {
      setError('');
      setIsListening(true);
      setVoiceText('');
      setFoundProducts([]);
      setShowProducts(false);
      setShowFallback(false);
      setProcessingMethod('');

      // Start recording
      await voiceRecorderRef?.current?.startRecording();
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setError(error?.message || 'Failed to start recording');
      setIsListening(false);
      toast?.error('Failed to access microphone');
    }
  };

  const handleStopListening = async () => {
    if (!isListening || !voiceRecorderRef?.current?.isRecording()) return;

    try {
      setIsListening(false);
      setIsProcessing(true);

      // Stop recording and get audio blob
      const audioBlob = await voiceRecorderRef?.current?.stopRecording();

      // Process voice input with OpenAI Whisper
      const result = await processVoiceInput(audioBlob);

      setProcessingMethod(result?.method || 'unknown');

      if (result?.success) {
        // Success case - AI transcription worked
        setVoiceText(result?.transcription || '');
        setFoundProducts(result?.products || []);
        setShowProducts(true);
        setShowFallback(false);

        // Save voice intent to database
        if (user?.id && result?.transcription) {
          try {
            await supabase?.from('voice_intents')?.insert([{
              user_id: user?.id,
              raw_text: result?.transcription
            }]);
          } catch (dbError) {
            console.error('Failed to save voice intent:', dbError);
          }
        }

        toast?.success('Speech processed successfully!', {
          icon: '🎤',
        });
      } else if (result?.requiresManualInput) {
        // Fallback case - AI not available
        setShowFallback(true);
        setError(result?.message || 'AI transcription temporarily unavailable');
        toast?.error(result?.message || 'Please try manual input', {
          icon: '⚠️',
          duration: 4000,
        });
      }

    } catch (error) {
      console.error('Error processing voice input:', error);
      
      // Enhanced error handling for different scenarios
      if (error?.message?.includes('quota exceeded')) {
        setError('OpenAI API quota exceeded. Please use manual search or try again later.');
        setShowFallback(true);
        toast?.error('Voice AI temporarily unavailable - use manual search', {
          icon: '⚠️',
          duration: 5000,
        });
      } else if (error?.message?.includes('No speech detected')) {
        setError('No speech detected. Please try speaking again.');
        toast?.error('No speech detected - please try again');
      } else {
        setError(error?.message || 'Failed to process voice input');
        setShowFallback(true);
        toast?.error('Voice processing failed - try manual search');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSearch = async () => {
    if (!manualInput?.trim()) {
      toast?.error('Please enter a search query');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');

      const result = await processManualTextInput(manualInput);
      
      setVoiceText(result?.transcription || '');
      setFoundProducts(result?.products || []);
      setShowProducts(true);
      setProcessingMethod(result?.method || 'manual');

      // Save manual search to database
      if (user?.id && result?.transcription) {
        try {
          await supabase?.from('voice_intents')?.insert([{
            user_id: user?.id,
            raw_text: result?.transcription
          }]);
        } catch (dbError) {
          console.error('Failed to save search intent:', dbError);
        }
      }

      toast?.success('Search completed successfully!', {
        icon: '🔍',
      });

    } catch (error) {
      console.error('Error processing manual search:', error);
      setError(error?.message || 'Failed to search products');
      toast?.error(error?.message || 'Search failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmTranscription = () => {
    if (!voiceText?.trim()) return;

    // Show success state
    setIsSuccess(true);
    toast?.success('Search confirmed!', {
      icon: '✅',
      duration: 3000,
    });

    // Auto close after success
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleAddToCart = (product) => {
    try {
      addToCart(product, 1);
      toast?.success(`${product?.name} added to cart!`, {
        icon: '🛒',
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast?.error('Failed to add item to cart');
    }
  };

  const handleClose = () => {
    // Stop any ongoing recording
    if (isListening) {
      voiceRecorderRef?.current?.cleanup();
    }
    
    setIsListening(false);
    setIsProcessing(false);
    setIsSuccess(false);
    setVoiceText('');
    setFoundProducts([]);
    setShowProducts(false);
    setShowFallback(false);
    setManualInput('');
    setProcessingMethod('');
    setError('');
    onClose?.();
  };

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget && !isProcessing && !isListening) {
      handleClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card rounded-2xl w-full max-w-lg shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">AI Voice Discovery</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {processingMethod === 'manual' ? 'Manual search active' : 'Speak to find products instantly'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={isProcessing || isListening}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error Display with Enhanced Information */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-destructive font-medium text-sm">Voice Processing Issue</p>
                  <p className="text-destructive/80 text-sm mt-1">{error}</p>
                  {error?.includes('quota exceeded') && (
                    <p className="text-muted-foreground text-xs mt-2">
                      💡 You can still search manually using the text box below
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Microphone Section */}
          {!showFallback && (
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 ${
                isSuccess 
                  ? 'bg-success/20 text-success' 
                  : isProcessing
                    ? 'bg-warning/20 text-warning'
                    : isListening 
                      ? 'bg-primary/20 text-primary animate-pulse' :'bg-muted text-muted-foreground hover:bg-primary/10'
              }`}>
                {isSuccess ? (
                  <CheckCircle2 className="w-8 h-8" />
                ) : isProcessing ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </div>
              
              <div className="mt-4">
                {isSuccess ? (
                  <p className="text-success font-medium">Search completed successfully!</p>
                ) : isProcessing ? (
                  <p className="text-warning font-medium">Processing speech...</p>
                ) : isListening ? (
                  <p className="text-primary font-medium">Listening... Speak now!</p>
                ) : (
                  <p className="text-muted-foreground">Tap to start voice search</p>
                )}
              </div>
            </div>
          )}

          {/* Fallback Manual Input Section */}
          {showFallback && (
            <div className="bg-surface border border-border rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Edit3 className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-medium text-foreground">Manual Search</h3>
                  <p className="text-sm text-muted-foreground">Type your product search below</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Input
                  value={manualInput}
                  onChange={(e) => setManualInput(e?.target?.value || '')}
                  placeholder="e.g., cement bags, PVC pipes, steel rods..."
                  disabled={isProcessing}
                  className="w-full"
                />
                <Button
                  onClick={handleManualSearch}
                  disabled={!manualInput?.trim() || isProcessing}
                  className="w-full flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Search Products
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Voice Text Input */}
          {!showFallback && (
            <div className="space-y-3">
              <label htmlFor="voice-text" className="block text-sm font-medium text-foreground">
                Speech Recognition Result:
              </label>
              <div className="relative">
                <Input
                  id="voice-text"
                  value={voiceText}
                  onChange={(e) => setVoiceText(e?.target?.value || '')}
                  placeholder={isListening ? "Listening for your voice..." : "Speak or type your product search"}
                  disabled={isListening || isProcessing}
                  className="min-h-[80px] resize-none pr-10"
                  multiline
                />
                {voiceText && (
                  <Volume2 className="absolute top-3 right-3 w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!isSuccess && !showFallback && (
              <>
                <Button
                  variant={isListening ? "destructive" : "outline"}
                  onClick={isListening ? handleStopListening : handleStartListening}
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      Start Recording
                    </>
                  )}
                </Button>

                {showProducts && foundProducts?.length > 0 && (
                  <Button
                    onClick={handleConfirmTranscription}
                    disabled={!voiceText?.trim()}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    Confirm Search
                  </Button>
                )}
              </>
            )}
            
            {!showFallback && error?.includes('quota exceeded') && (
              <Button
                variant="secondary"
                onClick={() => setShowFallback(true)}
                className="flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Use Manual Search
              </Button>
            )}
          </div>

          {/* Product Results */}
          {showProducts && (
            <div className="space-y-4">
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    Found Products ({foundProducts?.length})
                  </h3>
                  {processingMethod && (
                    <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                      {processingMethod === 'ai' ? '🤖 AI Enhanced' : 
                       processingMethod === 'manual' ? '✍️ Manual' : '🔍 Basic Search'}
                    </span>
                  )}
                </div>
                
                {foundProducts?.length > 0 ? (
                  <div className="space-y-3">
                    {foundProducts?.map((product) => (
                      <div
                        key={product?.id}
                        className="bg-surface border border-border rounded-lg p-4 hover:bg-surface/80 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground text-sm">
                              {product?.name}
                            </h4>
                            <p className="text-muted-foreground text-xs mt-1">
                              Brand: {product?.brand || 'Generic'}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-primary font-semibold text-sm">
                                ₹{product?.price}
                              </span>
                              <span className="text-muted-foreground text-xs">
                                Stock: {product?.stock}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No products found for your search.</p>
                    <p className="text-sm text-muted-foreground mt-1">Try a different description.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Success State */}
          {isSuccess && (
            <Button
              onClick={handleClose}
              className="w-full"
            >
              Done
            </Button>
          )}

          {/* Demo Notice */}
          {!isSuccess && !showProducts && !showFallback && (
            <div className="bg-info/10 border border-info/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Volume2 className="w-4 h-4 text-info mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-info-foreground">AI Voice Search</p>
                  <p className="text-muted-foreground mt-1">
                    Powered by OpenAI Whisper. Supports Hindi, English, and Hinglish. 
                    If AI is unavailable, manual search is always available.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceOrderingModal;