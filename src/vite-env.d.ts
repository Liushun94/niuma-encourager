/// <reference types="vite/client" />

interface Window {
  niuma?: {
    minimize: () => void;
    close: () => void;
    togglePin: () => Promise<boolean>;
    platform: string;
  };
}
