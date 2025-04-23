
// Augment the global Window interface to include grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      // Add other methods if needed
    };
  }
}

// Ensure the module is recognized by TypeScript
export {};