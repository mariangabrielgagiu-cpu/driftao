
import React, { useState, useEffect, useRef } from 'react';
import { GeneratedPageData } from '../types';
import { Button } from './ui/Button';
import { DriftaoLogo } from './ui/DriftaoLogo';

interface GeneratedPageProps {
  data: GeneratedPageData;
  isLoading?: boolean;
  onReset: () => void;
  onSelectSegment: (segment: string) => void;
  availableSegments: string[];
  currentLanguage: string;
  onLaunchDashboard: () => void;
}

export const GeneratedPage: React.FC<GeneratedPageProps> = ({ 
  data, 
  isLoading, 
  onReset, 
  onSelectSegment, 
  availableSegments,
  currentLanguage,
  onLaunchDashboard
}) => {
  const { theme, content, meta } = data;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [customPersona, setCustomPersona] = useState('');
  
  // State for the Live Insight Component
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [exitInsightIndex, setExitInsightIndex] = useState<number | null>(null);
  const [isHoveringInsight, setIsHoveringInsight] = useState(false);
  const [isHoveringBenefit, setIsHoveringBenefit] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true); 

  // Ref for the Insight Card
  const insightCardRef = useRef<HTMLDivElement>(null);
  // Ref for the resumption timer
  const resumeAutoRotateTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
      return () => {
          if (resumeAutoRotateTimeout.current) {
              clearTimeout(resumeAutoRotateTimeout.current);
          }
      };
  }, []);

  // Ensure strict mapping of 3 insights
  const displayInsights = content.insights && content.insights.length >= 3 
    ? content.insights.slice(0, 3) 
    : [content.subheadline, content.subheadline, content.subheadline];

  // Auto-rotate logic for insights
  useEffect(() => {
    if (!isAutoRotating || isHoveringInsight || isHoveringBenefit) return;

    const intervalId = setInterval(() => {
      setCurrentInsightIndex((prev) => {
        setExitInsightIndex(prev);
        setTimeout(() => setExitInsightIndex(null), 600);
        return (prev + 1) % displayInsights.length;
      });
    }, 4000); // Slower rotation for readability

    return () => clearInterval(intervalId);
  }, [displayInsights.length, isHoveringInsight, isHoveringBenefit, isAutoRotating]);

  // Helper to determine font family class
  const getFontClass = () => {
    switch(theme.fontStyle) {
      case 'playful': return 'font-playful tracking-wide'; 
      case 'classic': return 'font-serif-custom'; 
      case 'bold': return 'font-display font-bold tracking-tight'; 
      case 'modern': default: return 'font-sans tracking-normal'; 
    }
  };

  // Helper for Shape/Radius
  const getRadiusClass = (isOuter: boolean = true) => {
      switch(theme.borderRadius) {
          case 'round': return isOuter ? 'rounded-[2.5rem]' : 'rounded-3xl';
          case 'soft': return isOuter ? 'rounded-3xl' : 'rounded-xl';
          case 'sharp': return 'rounded-sm'; // Industrial/Tech look
          default: return 'rounded-3xl';
      }
  };

  const handleSegmentClick = (segment: string) => {
    onSelectSegment(segment);
    setIsMenuOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (customPersona.trim()) {
          handleSegmentClick(customPersona);
          setCustomPersona('');
      }
  };

  const handleBenefitClick = (index: number) => {
    setIsAutoRotating(false);
    if (resumeAutoRotateTimeout.current) clearTimeout(resumeAutoRotateTimeout.current);
    if (currentInsightIndex !== index) {
        setExitInsightIndex(currentInsightIndex);
        setTimeout(() => setExitInsightIndex(null), 600);
        setCurrentInsightIndex(index);
    }
    if (insightCardRef.current) {
        insightCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    resumeAutoRotateTimeout.current = setTimeout(() => {
        setIsAutoRotating(true);
    }, 8000); 
  };

  // --- CUSTOM CSS FOR FLUID RGB GLOW ---
  const fluidGlowStyles = `
    @keyframes spin-slow {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes spin-reverse {
      0% { transform: rotate(360deg); }
      100% { transform: rotate(0deg); }
    }
    .fluid-glow-container {
      position: absolute;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      filter: blur(40px);
      opacity: 0.8;
      z-index: 0;
    }
    .fluid-gradient {
      position: absolute;
      inset: -50%;
      background: conic-gradient(from 0deg, #ff0000, #00ff00, #0000ff, #ff0000);
      animation: spin-slow 4s linear infinite;
    }
    .fluid-gradient-2 {
      position: absolute;
      inset: -50%;
      background: conic-gradient(from 180deg, #0000ff, #ff0000, #00ff00, #0000ff);
      animation: spin-reverse 5s linear infinite;
      mix-blend-mode: overlay;
    }
  `;

  return (
    <div 
      className={`min-h-screen w-full relative overflow-y-auto selection:bg-white/20 selection:text-white transition-all duration-700 ease-in-out ${getFontClass()}`} 
      style={{ 
          backgroundColor: theme.backgroundColor, 
          color: theme.textColor
      }}
    >
      <style>{fluidGlowStyles}</style>
      
      {/* --- CINEMATIC TRANSITION OVERLAY (FLUID RGB GLOW) --- */}
      {isLoading && (
        <div 
            className="fixed inset-0 z-[100] pointer-events-auto flex items-center justify-center animate-blur-in"
            style={{ 
                backgroundColor: 'rgba(9, 9, 11, 0.9)', // Force dark backdrop for the glow to pop
            }}
        >
             <div className="flex flex-col items-center justify-center relative">
                
                {/* FLUID RGB GLOW BACKDROP */}
                <div className="fluid-glow-container">
                    <div className="fluid-gradient"></div>
                    <div className="fluid-gradient-2"></div>
                </div>

                {/* LOGO ON TOP */}
                <div className="relative z-10 w-24 h-24 flex items-center justify-center">
                    <DriftaoLogo className="w-full h-full text-white drop-shadow-2xl" />
                </div>

                <div className="text-center space-y-2 mt-8 relative z-10">
                    <div className="text-sm font-bold tracking-[0.3em] uppercase animate-pulse text-white">
                        Morphing Reality
                    </div>
                    <div className="text-[10px] font-mono opacity-50 text-zinc-400">
                        Adapting Visual Cortex...
                    </div>
                </div>
             </div>
        </div>
      )}

      {/* --- IMMERSIVE BACKGROUND ENGINE (Subtle/Non-Tech) --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
            className="absolute inset-0 opacity-40 transition-colors duration-1000 ease-in-out"
            style={{ 
                background: `radial-gradient(circle at 50% 0%, ${theme.primaryColor}05, ${theme.backgroundColor} 70%)` 
            }}
        ></div>
        {/* Orbs Opacity Reduced drastically from 15% to 5% to remove 'Glow/Tech' feel */}
        <div 
            className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full blur-[120px] opacity-5 animate-[pulse_15s_ease-in-out_infinite]" 
            style={{ background: theme.primaryColor, animationDuration: '15s' }}
        ></div>
        <div 
            className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full blur-[140px] opacity-5 animate-[pulse_20s_ease-in-out_infinite]" 
            style={{ background: theme.secondaryColor, animationDelay: '2s', animationDuration: '20s' }}
        ></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay"></div>
      </div>

      {/* --- FLOATING NAVIGATION --- */}
      <nav className="fixed top-0 left-0 w-full px-6 py-6 flex justify-between items-center z-50 pointer-events-auto">
        <div className="flex items-center gap-3">
             <div className="w-8 h-8 flex items-center justify-center bg-black/5 rounded-full backdrop-blur-sm border border-black/5">
                <DriftaoLogo className="w-5 h-5" color={theme.textColor} />
             </div>
             <div 
                className={`px-5 py-2.5 transition-all duration-300 border backdrop-blur-md ${getRadiusClass(false)}`}
                style={{
                    backgroundColor: `${theme.cardColor}1A`, 
                    borderColor: `${theme.textColor}20`,
                }}
             >
                <span className="text-sm font-bold tracking-tight" style={{ color: theme.textColor }}>
                    {meta.productName}
                </span>
             </div>
        </div>

        {/* Center Nav: Persona Switcher */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-3">
            <div className="relative z-50">
                <button 
                    onClick={() => { setIsMenuOpen(!isMenuOpen); }}
                    className={`flex items-center gap-3 px-5 py-2.5 cursor-pointer transition-all duration-300 hover:scale-105 focus:outline-none group border backdrop-blur-md ${getRadiusClass(false)}`}
                    style={{
                        backgroundColor: `${theme.cardColor}1A`, 
                        borderColor: `${theme.textColor}20`,
                    }}
                >
                    <span className="text-[10px] uppercase tracking-widest font-mono transition-colors opacity-70" style={{color: theme.textColor}}>Perspective</span>
                    <div className="h-3 w-px opacity-20" style={{backgroundColor: theme.textColor}}></div>
                    <span className="text-xs font-bold uppercase tracking-wide flex items-center gap-2 whitespace-nowrap" style={{color: theme.textColor}}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ color: theme.primaryColor, backgroundColor: theme.primaryColor }}></span>
                        {meta.targetPersona}
                    </span>
                    {availableSegments.length > 0 && (
                       <svg 
                            className={`w-3 h-3 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} 
                            style={{color: theme.textColor}}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                       </svg>
                    )}
                </button>

                {availableSegments.length > 0 && (
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 w-80 pt-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top ${isMenuOpen ? 'opacity-100 visible scale-100 translate-y-0' : 'opacity-0 invisible scale-95 translate-y-[-8px]'}`}>
                        <div 
                            className={`border shadow-2xl p-2 flex flex-col gap-1 overflow-hidden ${getRadiusClass(true)}`}
                            style={{ 
                                backgroundColor: `${theme.cardColor}FF`, 
                                borderColor: `${theme.textColor}10` 
                            }}
                        >
                             <div className="px-4 py-3 text-[10px] font-mono opacity-50 uppercase tracking-widest flex items-center justify-between select-none border-b border-black/5 mb-1" style={{color: theme.textColor}}>
                                <span>Switch Perspective</span>
                                <span className={`text-[9px] px-1.5 py-0.5 border border-black/5 ${getRadiusClass(false)}`} style={{backgroundColor: `${theme.primaryColor}20`}}>AI Generated</span>
                             </div>
                             
                             <button 
                                onClick={() => handleSegmentClick('General Audience')} 
                                className={`w-full text-left px-4 py-3 text-xs transition-all duration-200 flex items-center justify-between group/item ${getRadiusClass(false)} ${meta.targetPersona === 'General Audience' ? 'font-bold shadow-inner' : 'font-medium hover:bg-black/5'}`}
                                style={{
                                    backgroundColor: meta.targetPersona === 'General Audience' ? `${theme.primaryColor}20` : 'transparent',
                                    color: theme.textColor
                                }}
                            >
                               <span>General Audience</span>
                               {meta.targetPersona === 'General Audience' && <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor]" style={{backgroundColor: theme.textColor, color: theme.textColor}}></div>}
                             </button>
                             
                             {availableSegments.map((segment) => (
                                <button 
                                    key={segment} 
                                    onClick={() => handleSegmentClick(segment)} 
                                    className={`w-full text-left px-4 py-3 text-xs transition-all duration-200 flex items-center justify-between group/item ${getRadiusClass(false)} ${meta.targetPersona === segment ? 'font-bold shadow-inner' : 'font-medium hover:bg-black/5'}`}
                                    style={{
                                        backgroundColor: meta.targetPersona === segment ? `${theme.primaryColor}20` : 'transparent',
                                        color: theme.textColor
                                    }}
                                >
                                  <span className="truncate pr-2">{segment}</span>
                                  {meta.targetPersona === segment && <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor]" style={{backgroundColor: theme.textColor, color: theme.textColor}}></div>}
                                </button>
                             ))}

                             <div className="mt-2 pt-2 border-t border-black/5 px-2 pb-1">
                                <form onSubmit={handleCustomSubmit} className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Create new segment..." 
                                        value={customPersona}
                                        onChange={(e) => setCustomPersona(e.target.value)}
                                        className={`w-full text-xs px-3 py-2 bg-black/5 border border-black/10 focus:border-black/30 outline-none pr-8 transition-colors ${getRadiusClass(false)}`}
                                        style={{ color: theme.textColor, borderColor: `${theme.primaryColor}30` }}
                                    />
                                    <button 
                                        type="submit"
                                        className={`absolute right-1 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 text-xs disabled:opacity-30 ${getRadiusClass(false)}`}
                                        disabled={!customPersona.trim()}
                                        style={{color: theme.primaryColor}}
                                    >
                                        GO
                                    </button>
                                </form>
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="flex items-center gap-3">
           <Button 
                variant="secondary" 
                onClick={onReset} 
                className={`!py-2.5 !px-6 !text-xs font-bold transition-all border hover:scale-105 backdrop-blur-md ${getRadiusClass(false)}`}
                style={{
                    backgroundColor: `${theme.cardColor}1A`, 
                    color: theme.textColor, 
                    borderColor: `${theme.textColor}20`,
                }}
            >
                Create New
            </Button>
            {/* NEW COMMAND CENTER BUTTON */}
            <Button 
                variant="primary" 
                onClick={onLaunchDashboard} 
                className={`!py-2.5 !px-6 !text-xs font-bold transition-all hover:scale-105 shadow-xl ${getRadiusClass(false)}`}
                style={{
                     backgroundColor: theme.primaryColor,
                     color: theme.backgroundColor
                }}
            >
                Command Center
            </Button>
        </div>
      </nav>

      {/* --- LEVITATING PILL POD --- */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-auto animate-levitate">
          <button 
            className={`group relative flex items-center gap-3 px-6 py-3 transition-all duration-300 hover:scale-105 backdrop-blur-md ${getRadiusClass(false)}`}
            style={{ 
                backgroundColor: `${theme.cardColor}E6`, 
                border: `1px solid ${theme.primaryColor}80`, 
                color: theme.textColor,
                boxShadow: `0 10px 30px -5px ${theme.primaryColor}40` 
            }}
          >
             <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${getRadiusClass(false)}`} 
                  style={{ backgroundColor: `${theme.primaryColor}10` }}>
             </div>
             
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{backgroundColor: theme.primaryColor}}></span>
                <span className="relative inline-flex rounded-full h-2 w-2" style={{backgroundColor: theme.primaryColor}}></span>
             </span>
             <span className="relative text-xs md:text-sm font-bold tracking-widest uppercase flex items-center gap-2">
                {content.floatingCta || "Start Journey"}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
             </span>
          </button>
      </div>

      {/* --- BENTO GRID LAYOUT --- */}
      <main key={`${meta.targetPersona}-${isLoading}`} className="relative z-10 pt-32 pb-32 px-4 md:px-8 max-w-[1400px] mx-auto animate-enter">
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[minmax(200px,auto)] gap-4 md:gap-6">
            
            {/* COMPONENT A: HERO CARD (2x2) */}
            <div 
                className={`md:col-span-2 md:row-span-2 relative overflow-hidden group min-h-[500px] flex flex-col justify-center items-start text-left p-8 md:p-12 shadow-2xl transition-all duration-500 hover:shadow-[0_20px_80px_-20px_rgba(0,0,0,0.5)] border ${getRadiusClass(true)}`}
                style={{ 
                    backgroundColor: `${theme.cardColor}`, 
                    borderColor: `${theme.primaryColor}30`,
                }}
            >
                {/* Background Image/Gradient */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={`https://picsum.photos/seed/${meta.productName + meta.targetPersona}/1200/1200`} 
                        alt="Hero" 
                        className="w-full h-full object-cover opacity-60 mix-blend-overlay transition-transform duration-1000 group-hover:scale-105" 
                    />
                    <div 
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(to top, ${theme.cardColor} 10%, ${theme.cardColor}D9 40%, ${theme.cardColor}66 100%)`
                        }}
                    ></div>
                     <div 
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(to right, ${theme.cardColor}E6 0%, transparent 100%)`
                        }}
                    ></div>
                </div>

                <div className="relative z-10 max-w-3xl flex flex-col items-start">
                    <div 
                        className={`inline-flex items-center gap-2 px-3 py-1 border mb-8 w-fit ${getRadiusClass(false)}`}
                        style={{
                            backgroundColor: `${theme.secondaryColor}20`,
                            borderColor: `${theme.secondaryColor}60`
                        }}
                    >
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: theme.accentColor}}></span>
                        <span className="text-[10px] font-mono uppercase tracking-widest opacity-80" style={{color: theme.textColor}}>Tailored for you</span>
                    </div>
                    <h1 
                        className="text-5xl md:text-7xl font-bold leading-[0.9] tracking-tight mb-6 drop-shadow-2xl"
                        style={{ color: theme.textColor }}
                    >
                        {content.headline}
                    </h1>
                    <div className="flex gap-4 opacity-0 transform translate-y-4 transition-all duration-700 delay-200 group-hover:opacity-100 group-hover:translate-y-0">
                        <span className="text-sm font-mono opacity-60" style={{color: theme.textColor}}>{meta.productName} Intelligence Layer</span>
                    </div>
                </div>
            </div>

            {/* COMPONENT B: INSIGHT CARD */}
            <div 
                ref={insightCardRef}
                className={`md:col-span-1 md:row-span-1 relative p-8 flex flex-col justify-between border overflow-hidden group cursor-default transition-all duration-500 ${!isAutoRotating ? 'scale-[1.02]' : ''} ${getRadiusClass(true)}`}
                style={{ 
                    backgroundColor: `${theme.cardColor}`, 
                    borderColor: !isAutoRotating ? `${theme.primaryColor}80` : `${theme.primaryColor}20`,
                    boxShadow: !isAutoRotating ? `0 0 30px -5px ${theme.primaryColor}10` : 'none'
                }}
                onMouseEnter={() => setIsHoveringInsight(true)}
                onMouseLeave={() => setIsHoveringInsight(false)}
            >
                 <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <div className="relative z-10 flex justify-between items-center mb-6">
                     <div className="flex items-center gap-3 opacity-80" style={{color: theme.textColor}}>
                         <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${!isAutoRotating ? 'animate-none opacity-100 scale-125' : 'animate-pulse'}`} style={{ backgroundColor: theme.primaryColor, color: theme.primaryColor }}></div>
                         <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-bold">Why It Matters</span>
                     </div>
                 </div>

                 <div className="relative z-10 flex-grow w-full flex items-center justify-center overflow-hidden min-h-[180px]">
                     {displayInsights.map((insight, idx) => {
                        const cardClasses = "absolute w-full flex flex-col items-center justify-center px-4";
                        if (idx === currentInsightIndex) {
                            return (
                                <div key={`current-${idx}`} className={`${cardClasses} animate-card-drop z-20`}>
                                    <p 
                                        className="max-w-[90%] text-lg md:text-xl font-medium leading-relaxed text-center mx-auto"
                                        style={{ color: theme.textColor }}
                                    >
                                        {insight}
                                    </p>
                                </div>
                            );
                        }
                        if (idx === exitInsightIndex) {
                             return (
                                <div key={`exit-${idx}`} className={`${cardClasses} animate-card-exit-down z-10`}>
                                    <p 
                                        className="max-w-[90%] text-lg md:text-xl font-medium leading-relaxed text-center mx-auto"
                                        style={{ color: theme.textColor }}
                                    >
                                        {insight}
                                    </p>
                                </div>
                            );
                        }
                        return null;
                     })}
                 </div>
                 
                 <div className="relative z-10 mt-8 flex items-center justify-center">
                     <div className="flex gap-2">
                        {displayInsights.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`h-1.5 rounded-full transition-all duration-500 ease-out ${idx === currentInsightIndex ? 'w-8 shadow-[0_0_10px_currentColor]' : 'w-1.5 opacity-20'}`}
                                style={{ backgroundColor: theme.primaryColor, color: theme.primaryColor }}
                            ></div>
                        ))}
                     </div>
                 </div>
            </div>

            {/* COMPONENT C: VERDICT CARD */}
            <div 
                className={`md:col-span-1 md:row-span-1 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 ${getRadiusClass(true)}`}
                style={{ 
                    background: `${theme.cardColor}`, 
                    borderColor: `${theme.primaryColor}30`,
                    borderWidth: '1px'
                }}
            >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-in-out overflow-hidden"
                     style={{
                         background: theme.cardColor 
                     }}
                >
                    <div className="absolute top-[-30%] left-[-30%] w-[160%] h-[160%] rounded-full filter blur-[80px] animate-blob will-change-transform opacity-30" 
                         style={{ backgroundColor: theme.primaryColor }}></div>
                    <div className="absolute top-[-30%] right-[-30%] w-[160%] h-[160%] rounded-full filter blur-[80px] animate-blob animation-delay-2000 will-change-transform opacity-30" 
                         style={{ backgroundColor: theme.secondaryColor }}></div>
                    <div className="absolute bottom-[-30%] left-[20%] w-[160%] h-[160%] rounded-full filter blur-[80px] animate-blob animation-delay-4000 will-change-transform opacity-20" 
                         style={{ backgroundColor: theme.accentColor }}></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-soft-light"></div>
                </div>
                
                <div className="absolute inset-0 opacity-10" style={{backgroundColor: theme.primaryColor}}></div>

                <div className="relative z-10 p-8 flex flex-col justify-center items-center text-center h-full">
                    <div 
                        className="mb-4 opacity-50 group-hover:opacity-80 transition-opacity uppercase text-[10px] font-mono tracking-[0.2em]"
                        style={{ color: theme.textColor }}
                    >
                        Verdict
                    </div>
                    <p 
                        className="text-lg md:text-xl font-medium leading-relaxed drop-shadow-lg relative"
                        style={{ color: theme.textColor }}
                    >
                        "{content.verdict}"
                    </p>
                    <div className="w-12 h-1 mt-6 rounded-full group-hover:w-24 transition-all duration-500 bg-white/20 group-hover:bg-white"></div>
                </div>
            </div>

            {/* COMPONENT D, E, F: BENEFITS TRIO */}
            {content.benefits.slice(0, 3).map((benefit, idx) => {
                const isActive = idx === currentInsightIndex;
                return (
                    <div 
                        key={idx}
                        onClick={() => handleBenefitClick(idx)}
                        onMouseEnter={() => setIsHoveringBenefit(true)}
                        onMouseLeave={() => setIsHoveringBenefit(false)}
                        className={`md:col-span-1 relative p-8 border flex flex-col justify-between group transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] min-h-[220px] cursor-pointer ${getRadiusClass(true)} ${
                            isActive 
                                ? 'scale-[1.02] z-10' 
                                : 'opacity-80 hover:opacity-100 scale-100 z-0'
                        }`}
                        style={{
                            background: isActive 
                                ? `linear-gradient(to bottom right, ${theme.cardColor}, ${theme.primaryColor}10)` 
                                : `${theme.cardColor}`, 
                            borderColor: isActive ? theme.primaryColor : `${theme.primaryColor}10`,
                            borderWidth: '1px',
                            boxShadow: 'none'
                        }}
                    >
                        {isActive && (
                            <div 
                                className="absolute inset-0 pointer-events-none opacity-5"
                                style={{
                                    background: theme.primaryColor
                                }}
                            ></div>
                        )}

                        <div className="mb-4 relative z-10">
                            {benefit.stat && (
                                <div 
                                    className={`text-3xl md:text-4xl font-display font-bold mb-3 tracking-tight transition-colors duration-500`} 
                                    style={{ color: theme.textColor }}
                                >
                                    {benefit.stat}
                                </div>
                            )}
                            <h4 
                                className="text-lg font-bold mb-2 flex items-center gap-2 transition-colors duration-500" 
                                style={{color: theme.textColor}}
                            >
                                {benefit.title}
                            </h4>
                            <p 
                                className={`text-sm leading-relaxed font-medium transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-70'}`} 
                                style={{color: theme.textColor}}
                            >
                                {benefit.description}
                            </p>
                        </div>
                        {isActive && (
                            <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
                                <span className="text-[9px] font-mono uppercase tracking-widest opacity-50" style={{color: theme.textColor}}>Active</span>
                                <div className="w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_currentColor]" style={{backgroundColor: theme.primaryColor, color: theme.primaryColor}}></div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>

        <div className="mt-20 text-center opacity-30">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] mb-4">Powered by DRIFTAO APP</p>
            <div className="flex justify-center gap-2">
                {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full" style={{backgroundColor: theme.textColor}}></div>)}
            </div>
        </div>
      </main>
    </div>
  );
};
