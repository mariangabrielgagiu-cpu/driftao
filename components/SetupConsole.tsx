
import React, { useState } from 'react';
import { Button } from './ui/Button';

interface SetupConsoleProps {
  onGenerate: (url: string, persona: string, desc: string, language: string) => void;
  isLoading: boolean;
}

const LANGUAGES = [
  { code: 'English', label: 'English' },
  { code: 'Romanian', label: 'Romanian' },
  { code: 'Spanish', label: 'Spanish' },
  { code: 'French', label: 'French' },
  { code: 'German', label: 'German' },
];

export const SetupConsole: React.FC<SetupConsoleProps> = ({ onGenerate, isLoading }) => {
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [manualPersona, setManualPersona] = useState('');
  const [companyName, setCompanyName] = useState(''); // Visual only for now, inferred by AI usually
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('English');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPersona = mode === 'auto' ? 'General Audience' : manualPersona;
    onGenerate(url, targetPersona, description, language);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#111113] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative">
      {/* Console Header */}
      <div className="bg-zinc-900/50 border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
        </div>
        <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          Configuration Protocol
        </div>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Source */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-zinc-800 text-[10px] flex items-center justify-center text-zinc-400">1</span>
              Source Data
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-xs text-zinc-500">Target URL</label>
                  <input 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/product"
                    className="w-full bg-zinc-950 text-zinc-300 px-4 py-3 rounded-lg border border-zinc-800 focus:border-[#E17E8D] focus:ring-1 focus:ring-[#E17E8D] outline-none transition-all font-mono text-sm"
                    required
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-xs text-zinc-500">Output Language</label>
                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-zinc-950 text-zinc-300 px-4 py-3 rounded-lg border border-zinc-800 focus:border-[#E17E8D] outline-none transition-all text-sm appearance-none cursor-pointer"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>{lang.label}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
               </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs text-zinc-500">Product Context (Optional)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe what makes this special..."
                  className="w-full bg-zinc-950 text-zinc-300 px-4 py-3 rounded-lg border border-zinc-800 focus:border-zinc-700 outline-none transition-all text-sm h-20 resize-none"
                />
            </div>
          </div>

          <div className="h-px w-full bg-zinc-800/50"></div>

          {/* Section 2: Segmentation Strategy */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-zinc-800 text-[10px] flex items-center justify-center text-zinc-400">2</span>
                Segmentation Logic
                </h3>
                
                <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                    <button
                        type="button"
                        onClick={() => setMode('auto')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${mode === 'auto' ? 'bg-[#E17E8D] text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Auto-Detect
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('manual')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${mode === 'manual' ? 'bg-[#E17E8D] text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Manual
                    </button>
                </div>
            </div>

            <div className="bg-zinc-900/30 p-4 rounded-lg border border-zinc-800/50 min-h-[80px] flex items-center">
                {mode === 'auto' ? (
                    <div className="flex items-start gap-3 text-zinc-400 text-sm">
                        <svg className="w-5 h-5 text-[#E17E8D] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        <p>
                            AI will analyze the landing page and generate a standard version, then propose <span className="text-white font-medium">4 high-conversion segments</span> for you to explore.
                        </p>
                    </div>
                ) : (
                    <div className="w-full space-y-2">
                        <label className="text-xs text-zinc-500">Define Persona</label>
                        <input 
                            type="text" 
                            value={manualPersona}
                            onChange={(e) => setManualPersona(e.target.value)}
                            placeholder="e.g. Enterprise CTO, Budget-Conscious Student..."
                            className="w-full bg-zinc-950 text-white px-4 py-2 rounded border border-zinc-700 focus:border-[#E17E8D] outline-none"
                            autoFocus
                        />
                    </div>
                )}
            </div>
          </div>

          <Button 
            type="submit" 
            fullWidth 
            className="mt-4"
            disabled={isLoading || !url}
          >
            {isLoading ? 'Processing...' : 'Initialize Transformation'}
          </Button>
        </form>
      </div>
      
      {/* Decorative Grid at bottom of console */}
      <div className="h-2 w-full bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] opacity-10"></div>
    </div>
  );
};
