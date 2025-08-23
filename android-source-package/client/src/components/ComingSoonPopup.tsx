import { X, Sparkles, Clock, Bell } from "lucide-react";
import { useState, useEffect } from "react";

interface ComingSoonPopupProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

export default function ComingSoonPopup({ isOpen, onClose, featureName = "This Feature" }: ComingSoonPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
        <div className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Coming Soon</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{featureName}</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                We're working hard to bring you this feature. Stay tuned for updates in future versions!
              </p>
            </div>

            {/* Feature Preview */}
            <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
              <div className="flex items-center gap-3 mb-2">
                <Bell className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Coming Soon</span>
              </div>
              <p className="text-xs text-gray-400">
                This feature is currently in development and will be available soon.
              </p>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button 
                onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}