
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  initializePixels, 
  trackPageView as trackPageViewService,
  getPixelSettings,
  PixelSettings,
  TrackPurchaseData
} from '@/services/pixelService';

interface PixelContextType {
  pixelSettings: PixelSettings | null;
  isInitialized: boolean;
  trackPurchase: (data: TrackPurchaseData) => void;
  trackPageView: () => void;
}

const PixelContext = createContext<PixelContextType>({
  pixelSettings: null,
  isInitialized: false,
  trackPurchase: () => {},
  trackPageView: () => {}
});

export const usePixel = () => useContext(PixelContext);

interface PixelProviderProps {
  children: ReactNode;
}

export const PixelProvider: React.FC<PixelProviderProps> = ({ children }) => {
  const location = useLocation();
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [pixelSettings, setPixelSettings] = React.useState<PixelSettings | null>(null);

  // Initialize pixels on first load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getPixelSettings();
        setPixelSettings(settings);
        
        // Check if we have settings and if any pixel is enabled
        if (settings && (
          (settings.googlePixelEnabled && settings.googlePixelId) || 
          (settings.metaPixelEnabled && settings.metaPixelId)
        )) {
          initializePixels();
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing pixels:', error);
      }
    };
    
    fetchSettings();
  }, []);

  // Track page views when location changes
  useEffect(() => {
    if (isInitialized) {
      trackPageViewService();
    }
  }, [location.pathname, isInitialized]);

  // Function to track page views explicitly
  const trackPageView = () => {
    if (isInitialized) {
      trackPageViewService();
    }
  };

  // Function to track purchases
  const trackPurchase = (data: TrackPurchaseData) => {
    if (isInitialized) {
      import('@/services/pixelService').then(module => {
        module.trackPurchase(data);
      });
    }
  };

  return (
    <PixelContext.Provider value={{ 
      pixelSettings, 
      isInitialized, 
      trackPurchase,
      trackPageView
    }}>
      {children}
    </PixelContext.Provider>
  );
};

export default PixelProvider;
