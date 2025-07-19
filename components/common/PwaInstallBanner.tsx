
import React from 'react';
import { X, Share, MoreVertical } from 'lucide-react';
import Card from './Card';

interface PwaInstallBannerProps {
  onClose: () => void;
}

const PwaInstallBanner: React.FC<PwaInstallBannerProps> = ({ onClose }) => {
  const handleClose = () => {
    try {
        localStorage.setItem('installBannerDismissed', 'true');
    } catch (error) {
        console.error("Could not save dismissal state to localStorage", error);
    }
    onClose();
  };
  
  // Simple check for iOS/iPadOS
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div className="mb-4 animate-fade-in">
        <Card className="p-4 bg-brand-green-100 border border-brand-green-800">
        <div className="flex items-start">
            <div className="flex-grow">
            <h4 className="font-bold text-brand-green-900">Install DIY Pro Assistant!</h4>
            <p className="text-sm text-gray-700 mt-1">
                For the best experience, add this app to your home screen.
            </p>
            {isIOS ? (
                <div className="text-sm text-gray-700 mt-2 flex items-center flex-wrap">
                Tap the Share icon <Share className="w-4 h-4 mx-1" />, then scroll down and tap 'Add to Home Screen'.
                </div>
            ) : (
                <div className="text-sm text-gray-700 mt-2 flex items-center flex-wrap">
                Tap the menu button <MoreVertical className="w-4 h-4 mx-1" />, then tap 'Install app' or 'Add to Home Screen'.
                </div>
            )}
            </div>
            <button onClick={handleClose} className="p-1 rounded-full hover:bg-brand-brown-100 transition-colors ml-2 flex-shrink-0" aria-label="Dismiss install guide">
            <X className="w-5 h-5 text-gray-600" />
            </button>
        </div>
        </Card>
    </div>
  );
};

export default PwaInstallBanner;
