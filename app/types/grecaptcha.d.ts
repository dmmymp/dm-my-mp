
/* eslint-disable @typescript-eslint/no-unused-vars */

// Extend the Window interface to include grecaptcha
interface Window {
  grecaptcha: {
    ready: (callback: () => void) => void;
    execute: (siteKey: string, options: { action: string }) => Promise<string>;
    // Add other methods if needed
  };
}

// Ensure the module is recognized by TypeScript
export {};
