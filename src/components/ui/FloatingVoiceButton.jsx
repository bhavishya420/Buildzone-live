import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import VoiceOrderingModal from '../../pages/voice-ordering-modal';

const FloatingVoiceButton = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Only show on home dashboard
  if (location?.pathname !== '/home-dashboard') {
    return null;
  }

  const handleVoiceOrder = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-20 right-4 z-30">
        <Button
          variant="default"
          size="icon"
          onClick={handleVoiceOrder}
          className="w-14 h-14 rounded-full shadow-elevated hover:shadow-lg transition-all duration-300 bg-primary hover:bg-primary/90"
          title="Voice Ordering"
        >
          <Icon
            name="Mic"
            size={24}
            className="text-white"
          />
        </Button>
      </div>

      {/* Voice Ordering Modal */}
      <VoiceOrderingModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default FloatingVoiceButton;