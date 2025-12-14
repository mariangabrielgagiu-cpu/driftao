
export interface GeneratedPageData {
  meta: {
    productName: string;
    targetPersona: string;
  };
  suggestedSegments?: string[]; 
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    cardColor: string; 
    textColor: string;
    fontStyle: 'modern' | 'classic' | 'playful' | 'bold';
    borderRadius: 'sharp' | 'soft' | 'round'; // NEW: Controls the shape of cards/buttons
  };
  content: {
    headline: string;
    subheadline: string;
    insights: string[]; // STRICTLY 3 strings that map 1:1 to the benefits
    sonicBrand: {
      trackTitle: string; 
      mood: 'energetic' | 'calm' | 'mysterious' | 'futuristic'; 
    };
    ctaPrimary: string;
    verdict: string; 
    floatingCta: string; 
    benefits: Array<{
      title: string;
      description: string;
      icon: string; 
      stat?: string; 
    }>;
    socialProof: {
      quote: string;
      author: string;
      role: string;
    };
  };
}

export enum AppState {
  INPUT = 'INPUT',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
  DASHBOARD = 'DASHBOARD',
  ERROR = 'ERROR'
}
