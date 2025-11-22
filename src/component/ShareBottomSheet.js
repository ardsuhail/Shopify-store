"use client";
import { useEffect, useState } from "react";
import { 
  X, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Link2, 
  Share2,
  Copy
} from "lucide-react";

const ShareBottomSheet = ({ 
  isOpen, 
  onClose, 
  text = "Check out my order!", 
  url = window.location.href,
  title = "Shopovix Order"
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const shareOptions = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      url: `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
      url: `https://instagram.com/`
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
    },
    {
      id: 'copy',
      name: 'Copy Link',
      icon: Copy,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      action: 'copy'
    },
    {
      id: 'more',
      name: 'More',
      icon: Share2,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      action: 'more'
    }
  ];

  const handleOptionClick = async (option) => {
    if (option.action === 'copy') {
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(url);
          showToast('Link copied to clipboard!');
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = url;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          showToast('Link copied to clipboard!');
        }
      } catch (err) {
        showToast('Failed to copy link');
      }
      handleClose();
      return;
    }

    if (option.action === 'more') {
      if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            text: text,
            url: url,
          });
          handleClose();
          return;
        } catch (err) {
          // Share was cancelled, do nothing
          console.log('Share cancelled');
        }
      } else {
        showToast('Native sharing not supported');
      }
      return;
    }

    // For social media apps
    if (option.url) {
      if (option.id === 'instagram') {
        // Instagram doesn't support direct sharing, open app or profile
        window.open('https://instagram.com/', '_blank');
      } else {
        window.open(option.url, '_blank', 'width=600,height=400');
      }
      handleClose();
    }
  };

  const showToast = (message) => {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm z-50';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 2000);
  };

  if (!isMounted || !isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleOverlayClick}
      />
      
      {/* Bottom Sheet */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 shadow-2xl transform transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Share Order</h2>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Share Options Grid */}
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4">
            {shareOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option)}
                  className="flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <div className={`w-12 h-12 ${option.bgColor} rounded-full flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 ${option.color}`} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center">
                    {option.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Close Button */}
        <div className="px-6 pb-6 pt-2 border-t border-gray-100">
          <button
            onClick={handleClose}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 active:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>

        {/* Safe area for mobile */}
        <div className="h-6 bg-white" />
      </div>
    </>
  );
};

export default ShareBottomSheet;