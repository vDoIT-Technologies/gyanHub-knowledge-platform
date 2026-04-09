declare global {
    interface Window {
      sentience: {
        request: (args: any) => Promise<any>;
        selectedAddress: string;
        on: (event: string, callback: (accounts: string[]) => void) => void;
      };
    }
  }
  
  export {};
  