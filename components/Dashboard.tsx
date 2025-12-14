
import React, { useState, useRef, useEffect } from 'react';
import { GeneratedPageData } from '../types';
import { Button } from './ui/Button';

interface DashboardProps {
  data: GeneratedPageData;
  segments: string[];
  savedSegments: Record<string, GeneratedPageData>;
  onBack: () => void;
  onGenerateSegment: (segment: string) => void;
  isGenerating: boolean;
}

// CSS to hide scrollbars cleanly
const dashboardStyles = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// --- SNAPSHOT RENDERER (Exact Replica Logic) ---
const SnapshotRenderer: React.FC<{ data: GeneratedPageData }> = ({ data }) => {
  const { theme, content, meta } = data;
  
  const getFontClass = () => {
    switch(theme.fontStyle) {
      case 'playful': return 'font-playful tracking-wide'; 
      case 'classic': return 'font-serif-custom'; 
      case 'bold': return 'font-display font-bold tracking-tight'; 
      case 'modern': default: return 'font-sans tracking-normal'; 
    }
  };

  const getRadiusClass = (isOuter: boolean = true) => {
      switch(theme.borderRadius) {
          case 'round': return isOuter ? 'rounded-[2.5rem]' : 'rounded-3xl';
          case 'soft': return isOuter ? 'rounded-3xl' : 'rounded-xl';
          case 'sharp': return 'rounded-sm'; 
          default: return 'rounded-3xl';
      }
  };

  const BASE_WIDTH = 1200; 

  return (
    <div 
        className={`relative overflow-hidden flex flex-col ${getFontClass()}`} 
        style={{ 
            width: `${BASE_WIDTH}px`,
            backgroundColor: theme.backgroundColor, 
            color: theme.textColor,
            minHeight: '100%', // Allow it to fill height naturally
            paddingBottom: '40px'
        }}
    >
        {/* BACKGROUND LAYER */}
        <div className="absolute inset-0 pointer-events-none z-0">
             <div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 50% 0%, ${theme.primaryColor}05, ${theme.backgroundColor} 70%)` }}></div>
             <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[100px] opacity-10" style={{ background: theme.primaryColor }}></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[100px] opacity-10" style={{ background: theme.secondaryColor }}></div>
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
        </div>

        {/* NAVIGATION REPLICA */}
        <nav className="relative z-10 w-full px-8 py-8 flex justify-between items-center">
             <div className={`px-5 py-2.5 border backdrop-blur-md ${getRadiusClass(false)}`}
                  style={{ backgroundColor: `${theme.cardColor}1A`, borderColor: `${theme.textColor}20` }}>
                <span className="text-lg font-bold tracking-tight" style={{ color: theme.textColor }}>
                    {meta.productName}
                </span>
             </div>
             <div className={`flex items-center gap-3 px-5 py-2.5 border backdrop-blur-md ${getRadiusClass(false)}`}
                  style={{ backgroundColor: `${theme.cardColor}1A`, borderColor: `${theme.textColor}20` }}>
                  <span className="text-xs font-mono uppercase tracking-widest opacity-70" style={{color: theme.textColor}}>Perspective</span>
                  <div className="h-3 w-px opacity-20" style={{backgroundColor: theme.textColor}}></div>
                  <span className="text-sm font-bold uppercase tracking-wide flex items-center gap-2" style={{color: theme.textColor}}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primaryColor }}></div>
                        {meta.targetPersona}
                  </span>
             </div>
        </nav>

        {/* EXACT GRID LAYOUT */}
        <main className="relative z-10 p-8 pt-4 flex-grow">
             <div className="grid grid-cols-3 auto-rows-[minmax(220px,auto)] gap-6 h-full">
                
                {/* HERO (Span 2x2) */}
                <div 
                    className={`col-span-2 row-span-2 relative overflow-hidden flex flex-col justify-end text-left p-10 shadow-xl border ${getRadiusClass(true)}`}
                    style={{ 
                        backgroundColor: theme.cardColor, 
                        borderColor: `${theme.primaryColor}20`,
                        minHeight: '500px'
                    }}
                >
                    <div className="absolute inset-0 z-0">
                         <img 
                            src={`https://picsum.photos/seed/${meta.productName + meta.targetPersona}/1200/1200`} 
                            alt="Hero" 
                            className="w-full h-full object-cover opacity-50 mix-blend-overlay" 
                        />
                        <div className="absolute inset-0" style={{background: `linear-gradient(to top, ${theme.cardColor} 10%, ${theme.cardColor}CC 60%, ${theme.cardColor}40 100%)`}}></div>
                    </div>
                    <div className="relative z-10 max-w-2xl">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 mb-6 border ${getRadiusClass(false)}`} style={{ backgroundColor: `${theme.secondaryColor}20`, borderColor: `${theme.secondaryColor}40` }}>
                             <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: theme.accentColor}}></span>
                             <span className="text-[10px] uppercase tracking-widest opacity-90" style={{color: theme.textColor}}>Tailored Experience</span>
                        </div>
                        <h1 className="text-6xl font-bold leading-[0.95] tracking-tight mb-4 drop-shadow-lg" style={{ color: theme.textColor }}>
                            {content.headline}
                        </h1>
                        <p className="text-lg opacity-70 max-w-lg" style={{color: theme.textColor}}>
                            {content.subheadline}
                        </p>
                    </div>
                </div>

                {/* INSIGHT CARD */}
                <div 
                    className={`col-span-1 row-span-1 relative p-8 flex flex-col justify-between border overflow-hidden ${getRadiusClass(true)}`}
                    style={{ 
                        backgroundColor: theme.cardColor, 
                        borderColor: `${theme.primaryColor}40`,
                    }}
                >
                     <div className="flex items-center gap-2 opacity-80" style={{color: theme.textColor}}>
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primaryColor }}></div>
                         <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Key Insight</span>
                     </div>
                     <p className="text-2xl font-medium leading-tight" style={{ color: theme.textColor }}>
                        "{content.insights[0]}"
                     </p>
                     <div className="flex gap-1 mt-4">
                        <div className="h-1 w-6 rounded-full" style={{backgroundColor: theme.primaryColor}}></div>
                        <div className="h-1 w-1 rounded-full opacity-30" style={{backgroundColor: theme.primaryColor}}></div>
                        <div className="h-1 w-1 rounded-full opacity-30" style={{backgroundColor: theme.primaryColor}}></div>
                     </div>
                </div>

                {/* VERDICT CARD */}
                <div 
                    className={`col-span-1 row-span-1 relative p-8 flex flex-col justify-center items-center text-center border overflow-hidden ${getRadiusClass(true)}`}
                    style={{ 
                        background: theme.cardColor,
                        borderColor: `${theme.primaryColor}20`,
                    }}
                >
                     <div className="absolute inset-0 opacity-5" style={{backgroundColor: theme.primaryColor}}></div>
                     <div className="relative z-10">
                        <div className="mb-4 opacity-50 uppercase text-[10px] font-mono tracking-widest" style={{ color: theme.textColor }}>Verdict</div>
                        <p className="text-xl font-medium leading-snug" style={{ color: theme.textColor }}>"{content.verdict}"</p>
                     </div>
                </div>

                {/* BENEFITS */}
                {content.benefits.slice(0, 3).map((benefit, idx) => (
                    <div 
                        key={idx}
                        className={`col-span-1 relative p-8 border flex flex-col justify-between min-h-[220px] ${getRadiusClass(true)}`}
                        style={{
                            backgroundColor: theme.cardColor,
                            borderColor: `${theme.primaryColor}10`,
                        }}
                    >
                        <div>
                            {benefit.stat && <div className="text-3xl font-bold mb-2" style={{ color: theme.textColor }}>{benefit.stat}</div>}
                            <h4 className="text-lg font-bold mb-2 leading-tight" style={{color: theme.textColor}}>{benefit.title}</h4>
                            <p className="text-sm opacity-70 leading-relaxed" style={{color: theme.textColor}}>{benefit.description}</p>
                        </div>
                    </div>
                ))}

             </div>
        </main>
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ data, segments, savedSegments, onBack, onGenerateSegment, isGenerating }) => {
  // Initialize with the current persona to sync state on entry
  const [selectedSegment, setSelectedSegment] = useState<string | null>(data.meta.targetPersona);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Filter 'General Audience' out of the segments list
  const allSegments = Array.from(new Set([...segments, ...Object.keys(savedSegments)]))
    .filter(segment => segment !== 'General Audience');
  
  const productName = data.meta.productName;
  const slug = productName.toLowerCase().replace(/\s+/g, '-');
  const currentPersonaParam = selectedSegment && selectedSegment !== 'General Audience' 
    ? `?persona=${selectedSegment.toLowerCase().replace(/\s+/g, '-')}` 
    : '';
  const displayUrl = `driftao.com/p/${slug}${currentPersonaParam}`;

  // Use savedSegments if available to avoid prop mismatch, fallback to data
  const activeData = selectedSegment && savedSegments[selectedSegment] 
     ? savedSegments[selectedSegment] 
     : data;

  const isGenerated = selectedSegment ? !!savedSegments[selectedSegment] : true;

  const copyLink = (e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(`https://${displayUrl}`);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
  };

  const openLive = (e: React.MouseEvent) => {
      e.stopPropagation();
      alert(`Simulating navigation to:\nhttps://${displayUrl}\n\n(In a real app, this would open a new tab)`);
  };

  const handleViewFullPage = () => {
      // Update the main app state to the selected segment before navigating back
      if (selectedSegment) {
          onGenerateSegment(selectedSegment);
      }
      onBack();
  };

  // --- SCALING LOGIC ---
  const containerRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const calculateScale = () => {
        if (!containerRef.current || !contentWrapperRef.current) return;
        
        const container = containerRef.current;
        const content = contentWrapperRef.current;
        
        const containerW = container.clientWidth;
        const contentW = 1200; // Base width of the renderer
        
        // Calculate Scale to FIT WIDTH
        const newScale = containerW / contentW;
        
        setScale(newScale);
        
        if (content) {
            setContentHeight(content.scrollHeight);
        }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    
    const observer = new ResizeObserver(calculateScale);
    if (contentWrapperRef.current) {
        observer.observe(contentWrapperRef.current);
    }

    const timeout = setTimeout(calculateScale, 300);

    return () => {
        window.removeEventListener('resize', calculateScale);
        clearTimeout(timeout);
        observer.disconnect();
    };
  }, [activeData, isGenerated]);

  // Glassmorphism classes
  const glassCard = "bg-zinc-900/60 backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden";
  const glassOverlay = "absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none";

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 font-sans flex items-center justify-center overflow-hidden">
      <style>{dashboardStyles}</style>
      
      {/* 2-COLUMN LAYOUT WRAPPER */}
      <div className="w-full max-w-[1600px] h-[95vh] grid grid-cols-12 gap-6">

        {/* --- LEFT COLUMN: CONTROLS (3/12) --- */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4 h-full min-h-0">
            
            {/* 1. STATUS CARD */}
            <div className={`${glassCard} rounded-3xl p-6 flex-shrink-0`}>
                <div className={glassOverlay}></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">System Live</span>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Master Endpoint</div>
                            <button 
                                onClick={copyLink}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono border transition-all ${
                                    copySuccess 
                                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                                    : 'bg-black/40 border-white/5 text-zinc-300 hover:border-white/20'
                                }`}
                            >
                                <span>{copySuccess ? 'COPIED TO CLIPBOARD' : 'COPY MASTER LINK'}</span>
                                {!copySuccess && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>}
                            </button>
                        </div>

                        {/* Back to Landing Page Button */}
                        <button
                            onClick={handleViewFullPage}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide bg-white/5 hover:bg-white/10 text-white transition-all border border-white/5 hover:border-white/20"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            View Full Page
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. SEGMENT SELECTOR (Scrollable) */}
            <div className={`flex-grow ${glassCard} rounded-3xl p-4 flex flex-col min-h-0`}>
                <div className={glassOverlay}></div>
                <div className="relative z-10 flex flex-col h-full">
                    <div className="px-2 pb-3 mb-2 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Perspective Layer</span>
                    </div>
                    
                    <div className="flex-grow overflow-y-auto no-scrollbar space-y-4 pr-1">
                        {/* Master Segment Group */}
                        <div className="space-y-2">
                             <div className="px-2 text-[9px] font-mono text-zinc-600 uppercase tracking-wider">Root</div>
                             <button
                                onClick={() => setSelectedSegment('General Audience')}
                                className={`w-full text-left p-3 rounded-xl border transition-all duration-300 group ${
                                    selectedSegment === 'General Audience' 
                                    ? 'bg-[#E17E8D]/10 border-[#E17E8D]/50 shadow-[0_0_20px_rgba(225,126,141,0.1)]' 
                                    : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${selectedSegment === 'General Audience' ? 'bg-[#E17E8D] shadow-[0_0_8px_currentColor] scale-110' : 'bg-zinc-700'}`}></div>
                                    <div>
                                        <div className={`text-xs font-bold transition-colors ${selectedSegment === 'General Audience' ? 'text-[#E17E8D]' : 'text-zinc-300'}`}>General Audience</div>
                                        <div className="text-[9px] font-mono text-zinc-600 uppercase">Master Variant</div>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Dynamic Segments Group */}
                        {allSegments.length > 0 && (
                            <div className="space-y-2">
                                <div className="px-2 text-[9px] font-mono text-zinc-600 uppercase tracking-wider flex justify-between">
                                    <span>Variants</span>
                                    <span className="text-zinc-700">{allSegments.length}</span>
                                </div>
                                {allSegments.map((segment, idx) => {
                                    const isActive = selectedSegment === segment;
                                    const isReady = !!savedSegments[segment];
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedSegment(segment)}
                                            className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group ${
                                                isActive 
                                                ? 'bg-white/10 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                                                : 'bg-black/20 border-transparent hover:bg-white/5'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full transition-all ${isActive ? 'bg-white shadow-[0_0_8px_currentColor]' : 'bg-zinc-700'}`}></div>
                                                <div className="min-w-0 flex-1">
                                                    <div className={`text-xs font-bold truncate transition-colors ${isActive ? 'text-white' : 'text-zinc-400'}`}>{segment}</div>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-emerald-500/50' : 'bg-zinc-800'}`}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>

        {/* --- RIGHT COLUMN: BROWSER WINDOW (9/12) --- */}
        <div className="col-span-12 md:col-span-9 h-full flex flex-col min-h-0">
            
            <div className={`flex-grow ${glassCard} border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative group`}>
                
                {/* BROWSER CHROME HEADER */}
                <div className="h-14 bg-black/40 border-b border-white/5 flex items-center px-6 gap-6 shrink-0 z-20 select-none backdrop-blur-md">
                    {/* Traffic Lights */}
                    <div className="flex gap-2 opacity-80 hover:opacity-100 transition-opacity">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50"></div>
                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50"></div>
                        <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50"></div>
                    </div>

                    {/* URL Bar */}
                    <div className="flex-grow flex justify-center">
                        <div className="bg-white/5 border border-white/5 rounded-lg px-4 py-1.5 flex items-center gap-3 text-xs text-zinc-400 font-mono w-full max-w-lg shadow-inner group/url hover:bg-white/10 transition-colors cursor-text">
                            <svg className="w-3 h-3 text-zinc-600 group-hover/url:text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"/></svg>
                            <span className="truncate flex-grow text-center opacity-60">{displayUrl}</span>
                            <div className="w-3 h-3"></div> {/* Spacer for alignment */}
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="w-12 flex justify-end">
                        <button 
                            className="text-zinc-600 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg"
                            onClick={() => {
                                // Simulate refresh visual
                                const btn = document.getElementById('refresh-icon');
                                if(btn) btn.classList.add('animate-spin');
                                setTimeout(() => btn?.classList.remove('animate-spin'), 700);
                            }}
                        >
                            <svg id="refresh-icon" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </button>
                    </div>
                </div>

                {/* VIEWPORT CONTENT */}
                <div ref={containerRef} className="flex-grow relative bg-[#09090b] overflow-y-auto no-scrollbar">
                     {isGenerated ? (
                         <div style={{ height: contentHeight * scale, width: '100%', overflow: 'hidden' }}>
                             <div 
                                 ref={contentWrapperRef}
                                 className="origin-top-left"
                                 style={{
                                     width: '1200px', // Fixed base width
                                     transform: `scale(${scale})`,
                                 }}
                             >
                                <SnapshotRenderer data={activeData} />
                             </div>
                         </div>
                     ) : (
                        // Empty State (Centered)
                        <div className="w-full h-full flex flex-col items-center justify-center text-center z-30 p-8">
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="absolute inset-0 bg-[#E17E8D] blur-xl opacity-20 animate-pulse"></div>
                                <div className="relative w-full h-full rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                </div>
                            </div>
                            <h3 className="text-white font-bold text-2xl mb-2">Variant Not Compiled</h3>
                            <p className="text-zinc-500 text-sm max-w-xs mx-auto mb-8">
                                Content vectors for <span className="text-white">"{selectedSegment}"</span> are ready.
                            </p>
                            <Button 
                                onClick={() => onGenerateSegment(selectedSegment!)}
                                disabled={isGenerating}
                                className={isGenerating ? 'opacity-80' : ''}
                            >
                                {isGenerating ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Compiling...
                                    </span>
                                ) : 'Generate Variant'}
                            </Button>
                        </div>
                     )}
                </div>
                
                {/* MOVED OVERLAY */}
                {isGenerated && (
                    <div className="absolute top-14 left-0 right-0 bottom-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 flex items-center justify-center gap-4 pointer-events-none">
                        <div className="pointer-events-auto flex gap-4">
                            <Button 
                            onClick={openLive}
                            className="!bg-white !text-black hover:!bg-zinc-200 !py-3 !px-6 flex items-center gap-2 !rounded-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                Open Live
                            </Button>
                            <Button 
                            variant="outline"
                            className="!bg-black/50 !border-white/20 !text-white hover:!bg-black/80 !py-3 !px-6 flex items-center gap-2 !rounded-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                                QR Code
                            </Button>
                        </div>
                    </div>
                )}
            </div>

        </div>

      </div>
    </div>
  );
};
