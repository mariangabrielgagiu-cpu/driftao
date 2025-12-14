
import React, { useState } from 'react';
import { generateLandingPage } from './services/geminiService';
import { AppState, GeneratedPageData } from './types';
import { GeneratedPage } from './components/GeneratedPage';
import { SetupConsole } from './components/SetupConsole';
import { Dashboard } from './components/Dashboard';
import { DriftaoLogo } from './components/ui/DriftaoLogo';

// SVG Icons
const Sparkles = () => (
  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.39 8.26L20 9.27L15.55 12.97L17.27 18.5L12 15.1L6.73 18.5L8.45 12.97L4 9.27L9.61 8.26L12 2Z" fill="currentColor"/>
  </svg>
);

const App = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  // We keep track of the initial request params to reuse URL/Description for segment changes
  const [requestContext, setRequestContext] = useState({ url: '', description: '' });
  
  const [generatedData, setGeneratedData] = useState<GeneratedPageData | null>(null);
  const [segments, setSegments] = useState<string[]>([]);
  // Store all generated versions to allow switching without regeneration
  const [segmentCache, setSegmentCache] = useState<Record<string, GeneratedPageData>>({});
  
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('English');

  // Handle the initial generation from the Setup Console
  const handleInitialGenerate = async (url: string, persona: string, description: string, selectedLanguage: string) => {
    setAppState(AppState.LOADING);
    setError(null);
    setRequestContext({ url, description });
    setLanguage(selectedLanguage); 

    try {
      const data = await generateLandingPage(url, persona, description, selectedLanguage);
      setGeneratedData(data);
      
      // Save to cache
      setSegmentCache(prev => ({
        ...prev,
        [data.meta.targetPersona]: data
      }));
      
      // If the AI suggested segments (usually happens on 'General Audience'), store them
      if (data.suggestedSegments && data.suggestedSegments.length > 0) {
        setSegments(data.suggestedSegments);
      } else if (!segments.includes(persona)) {
        // If no suggestions, at least ensure the current persona is in the list
        setSegments([persona]);
      }
      
      setAppState(AppState.RESULT);
    } catch (err) {
      console.error(err);
      setError("We couldn't generate the page. Please check your inputs or try again later.");
      setAppState(AppState.ERROR);
    }
  };

  // State for "isUpdating"
  const [isUpdating, setIsUpdating] = useState(false);

  // Handle switching segments from the Generated Page Dock OR Dashboard
  const handleUpdatePersona = async (newPersona: string) => {
    if (isUpdating) return;

    // Check if we already have this segment cached to avoid API call
    if (segmentCache[newPersona]) {
      setGeneratedData(segmentCache[newPersona]);
      return;
    }

    setIsUpdating(true);
    
    try {
      const newData = await generateLandingPage(requestContext.url, newPersona, requestContext.description, language);
      
      // Ensure the new persona is added to the list if it was a custom type
      setSegments(prev => {
        if (!prev.includes(newPersona)) {
          return [...prev, newPersona];
        }
        return prev;
      });

      setGeneratedData({
        ...newData,
        suggestedSegments: segments // Keep the original list available
      });

      // Update Cache
      setSegmentCache(prev => ({
        ...prev,
        [newData.meta.targetPersona]: newData
      }));

    } catch (err) {
      console.error("Failed to update persona", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const resetApp = () => {
    setAppState(AppState.INPUT);
    setGeneratedData(null);
    setSegments([]);
    setSegmentCache({}); // Clear cache on reset
    setError(null);
    setRequestContext({ url: '', description: '' });
    setLanguage('English');
  };

  const handleLaunchDashboard = () => {
    setAppState(AppState.DASHBOARD);
  };

  if (appState === AppState.DASHBOARD && generatedData) {
    return (
      <Dashboard 
        data={generatedData}
        segments={segments}
        savedSegments={segmentCache}
        onBack={() => setAppState(AppState.RESULT)}
        onGenerateSegment={handleUpdatePersona}
        isGenerating={isUpdating}
      />
    );
  }

  if (appState === AppState.RESULT && generatedData) {
    return (
      <GeneratedPage 
        data={generatedData} 
        onReset={resetApp} 
        onSelectSegment={handleUpdatePersona}
        availableSegments={segments}
        isLoading={isUpdating}
        currentLanguage={language}
        onLaunchDashboard={handleLaunchDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white relative flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-grid-fade pointer-events-none" />

      {/* Header/Nav */}
      <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <div className="text-xl font-bold tracking-tighter flex items-center gap-3">
          <DriftaoLogo className="w-8 h-8 text-[#E17E8D]" />
          DRIFTAO
        </div>
        <div className="hidden md:flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-full px-4 py-1.5 text-xs font-medium text-zinc-400">
          <Sparkles />
          System v1.0
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-5xl px-6 py-12 flex flex-col items-center">
        
        {appState !== AppState.LOADING && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                Contextual <br className="hidden md:block" />
                <span className="text-[#E17E8D]">Intelligence</span> Engine
              </h1>
              
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                Configure your product parameters below. The system will generate a baseline experience and identify high-value personalization vectors automatically.
              </p>
            </div>

            <SetupConsole 
              onGenerate={handleInitialGenerate} 
              isLoading={appState === AppState.LOADING} 
            />
          </>
        )}

        {appState === AppState.LOADING && (
           <div className="flex flex-col items-center justify-center h-64 space-y-8 animate-pulse relative">
              {/* Fluid Glow Background */}
              <div className="absolute w-32 h-32 bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 rounded-full blur-[40px] opacity-40 animate-spin" style={{animationDuration: '4s'}}></div>
              {/* Logo */}
              <DriftaoLogo className="w-20 h-20 text-white relative z-10" />
              <div className="text-xl font-mono text-[#E17E8D] relative z-10">ANALYZING PRODUCT SEMANTICS...</div>
           </div>
        )}

        {/* Error Message */}
        {appState === AppState.ERROR && (
           <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg max-w-lg mx-auto text-sm text-center">
             <p className="font-bold mb-2">System Error</p>
             {error}
             <button onClick={() => setAppState(AppState.INPUT)} className="block mx-auto mt-4 underline hover:text-white">Reset Configuration</button>
           </div>
        )}

      </main>

      {/* Footer Gradients */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
};

export default App;
