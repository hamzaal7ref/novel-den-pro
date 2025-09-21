import React, { createContext, useContext } from 'react';
import { ReaderSettings } from '@/types/novel';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ReaderContextType {
  settings: ReaderSettings;
  updateSettings: (settings: Partial<ReaderSettings>) => void;
  resetSettings: () => void;
}

const DEFAULT_READER_SETTINGS: ReaderSettings = {
  fontSize: 16,
  fontFamily: 'Inter, sans-serif',
  lineHeight: 1.6,
  paragraphSpacing: 1.2,
  backgroundColor: '#ffffff',
  textColor: '#1a1a1a',
  theme: 'light',
  pageWidth: 800,
  padding: 40,
  textAlign: 'justify',
  columnCount: 1,
  autoScroll: false,
  scrollSpeed: 1,
  bionicReading: false,
  immersiveMode: false,
};

const ReaderContext = createContext<ReaderContextType | undefined>(undefined);

export function ReaderProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useLocalStorage<ReaderSettings>(
    'lnreader-reader-settings',
    DEFAULT_READER_SETTINGS
  );

  const updateSettings = (newSettings: Partial<ReaderSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_READER_SETTINGS);
  };

  const value: ReaderContextType = {
    settings,
    updateSettings,
    resetSettings,
  };

  return (
    <ReaderContext.Provider value={value}>
      {children}
    </ReaderContext.Provider>
  );
}

export function useReader() {
  const context = useContext(ReaderContext);
  if (context === undefined) {
    throw new Error('useReader must be used within a ReaderProvider');
  }
  return context;
}