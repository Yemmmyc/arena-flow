import React, { useState } from 'react';
import { 
  Sparkles, Settings, Terminal, Shield, Compass, Cpu, 
  HelpCircle, CheckCircle, Info, Accessibility, Heart 
} from 'lucide-react';
import StaffDashboard from './components/StaffDashboard';
import FanCompanion from './components/FanCompanion';
import { getStoredApiKey, setStoredApiKey, getStoredModel, setStoredModel } from './services/gemini';

export default function App() {
  const [activeTab, setActiveTab] = useState('ops'); // 'ops' or 'fan'
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getStoredApiKey());
  const [modelInput, setModelInput] = useState(getStoredModel());
  const [selectedStadium, setSelectedStadium] = useState('metlife');
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  const saveSettings = (e) => {
    e.preventDefault();
    setStoredApiKey(apiKeyInput);
    setStoredModel(modelInput);
    setIsSavedAlert(true);
    setTimeout(() => {
      setIsSavedAlert(false);
      setShowSettings(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-stadium-dark flex flex-col">
      {/* Top Banner and Navigation Bar */}
      <header className="bg-stadium-card border-b border-slate-800 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-stadium-accent to-stadium-pitch flex items-center justify-center font-bold text-stadium-dark text-lg shadow-glow">
                AF
              </div>
              <div>
                <h1 className="font-extrabold text-sm sm:text-base text-slate-100 tracking-tight flex items-center gap-1.5 font-sans">
                  ArenaFlow
                  <span className="text-[10px] bg-stadium-accent/15 border border-stadium-accent/30 text-stadium-accent px-1.5 py-0.5 rounded font-mono uppercase tracking-wider font-semibold">
                    FIFA 2026™
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400 font-medium">Smart Stadium operations & experience platform</p>
              </div>
            </div>

            {/* Toggle Switch */}
            <nav role="tablist" aria-label="Role Navigation Switcher" className="flex bg-stadium-dark/95 border border-slate-800 rounded-xl p-1 max-w-[320px] sm:max-w-md mx-2">
              <button 
                id="tab-ops-dashboard"
                role="tab"
                aria-selected={activeTab === 'ops'}
                aria-controls="panel-ops-dashboard"
                aria-label="Switch to Venue Operations Hub"
                onClick={() => setActiveTab('ops')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'ops' 
                    ? 'bg-stadium-accent text-stadium-dark shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal size={14} aria-hidden="true" />
                <span className="hidden sm:inline">Venue Ops Hub</span>
                <span className="inline sm:hidden">Ops</span>
              </button>
              
              <button 
                id="tab-fan-companion"
                role="tab"
                aria-selected={activeTab === 'fan'}
                aria-controls="panel-fan-companion"
                aria-label="Switch to Fan Companion"
                onClick={() => setActiveTab('fan')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'fan' 
                    ? 'bg-stadium-accent text-stadium-dark shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Compass size={14} aria-hidden="true" />
                <span className="hidden sm:inline">Fan Companion</span>
                <span className="inline sm:hidden">Fan</span>
              </button>
            </nav>

            {/* Config & Meta buttons */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-stadium-card border border-slate-700 rounded-xl px-2.5 py-1.5">
                <label id="lbl-stadium-selector" htmlFor="stadium-selector" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden md:inline">Venue:</label>
                <select
                  id="stadium-selector"
                  value={selectedStadium}
                  aria-labelledby="lbl-stadium-selector"
                  onChange={(e) => setSelectedStadium(e.target.value)}
                  className="bg-transparent text-xs font-bold text-stadium-accent focus:outline-none cursor-pointer"
                >
                  <option value="metlife" className="bg-stadium-card">MetLife Stadium (NY/NJ)</option>
                  <option value="sofi" className="bg-stadium-card">SoFi Stadium (LA)</option>
                  <option value="azteca" className="bg-stadium-card">Estadio Azteca (Mexico City)</option>
                </select>
              </div>

              <button 
                id="btn-settings-toggle"
                aria-label="Configure Gemini API Settings"
                onClick={() => setShowSettings(true)}
                className={`p-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 transition-colors relative ${
                  !getStoredApiKey() ? 'border-stadium-warning/45' : ''
                }`}
                title="Configure Gemini API Key"
              >
                <Settings size={18} aria-hidden="true" />
                {!getStoredApiKey() && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stadium-warning opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-stadium-warning text-[8px] font-bold text-stadium-dark items-center justify-center font-mono font-black">!</span>
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* API Warning banner if not present */}
        {!getStoredApiKey() && (
          <div className="mb-6 bg-stadium-warning/10 border border-stadium-warning/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-stadium-warning/10 rounded-lg text-stadium-warning mt-0.5 sm:mt-0">
                <Info size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stadium-warning uppercase tracking-wider">Demo Mode Fallback Active</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ArenaFlow is currently using local mock intelligence. To activate live Google Gemini models, enter your API Key in Settings.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowSettings(true)}
              className="text-[11px] font-bold text-stadium-dark bg-stadium-warning hover:bg-stadium-warning/80 px-3 py-1.5 rounded-lg transition-all"
            >
              Enter API Key
            </button>
          </div>
        )}

        {/* Tab Routing */}
        <section className="transition-all duration-300">
          {activeTab === 'ops' ? (
            <div id="panel-ops-dashboard" role="tabpanel" aria-labelledby="tab-ops-dashboard">
              <StaffDashboard stadium={selectedStadium} />
            </div>
          ) : (
            <div id="panel-fan-companion" role="tabpanel" aria-labelledby="tab-fan-companion">
              <FanCompanion stadium={selectedStadium} />
            </div>
          )}
        </section>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stadium-dark/80 backdrop-blur-sm p-4">
          <div className="glass-panel-glow rounded-2xl w-full max-w-md p-6 relative overflow-hidden">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-2">
              <Cpu className="text-stadium-accent" size={20} />
              Platform Configuration
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Enter your Gemini API key to enable live Generative AI decision mitigations and multilingual concierge lookups.
            </p>

            <form onSubmit={saveSettings} className="space-y-4" aria-label="API settings configuration">
              <div>
                <label id="lbl-api-key" htmlFor="input-api-key" className="block text-xs font-bold text-slate-300 mb-1.5">Gemini API Key</label>
                <input 
                  id="input-api-key"
                  type="password" 
                  aria-labelledby="lbl-api-key"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-stadium-dark border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-stadium-accent"
                />
              </div>

              <div>
                <label id="lbl-model-select" htmlFor="select-model" className="block text-xs font-bold text-slate-300 mb-1.5">AI Model Selection</label>
                <select 
                  id="select-model"
                  aria-labelledby="lbl-model-select"
                  value={modelInput}
                  onChange={(e) => setModelInput(e.target.value)}
                  className="w-full bg-stadium-dark border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-stadium-accent cursor-pointer"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended)</option>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                  <option value="gemini-3.5-flash">Gemini 3.5 Flash</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                  <option value="gemini-flash-latest">Gemini Flash (Latest)</option>
                  <option value="gemini-pro-latest">Gemini Pro (Latest)</option>
                  <option value="custom">-- Custom Model Name --</option>
                </select>
              </div>

              {modelInput === 'custom' || !['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-3.5-flash', 'gemini-2.5-pro', 'gemini-flash-latest', 'gemini-pro-latest'].includes(modelInput) ? (
                <div>
                  <label id="lbl-custom-model" htmlFor="input-custom-model" className="block text-xs font-bold text-slate-300 mb-1.5">Custom Model Name</label>
                  <input 
                    id="input-custom-model"
                    type="text" 
                    aria-labelledby="lbl-custom-model"
                    value={modelInput === 'custom' ? '' : modelInput}
                    onChange={(e) => setModelInput(e.target.value)}
                    placeholder="e.g. gemini-2.5-flash"
                    className="w-full bg-stadium-dark border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-stadium-accent"
                  />
                </div>
              ) : null}

              <div className="bg-stadium-dark/40 border border-slate-800 p-3 rounded-lg text-[10px] text-slate-400 leading-relaxed">
                💡 **Key Security**: Keys are stored locally on your device in `localStorage` and sent directly to Google APIs. They are never uploaded to any intermediary servers.
              </div>

              {isSavedAlert && (
                <div className="p-3 bg-stadium-pitch/10 border border-stadium-pitch/20 text-stadium-pitch text-[11px] font-bold rounded-lg flex items-center gap-2">
                  <CheckCircle size={14} />
                  Settings saved successfully!
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 border border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-bold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-stadium-accent hover:bg-stadium-accent/80 text-stadium-dark font-bold text-xs rounded-lg transition-all shadow-glow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-stadium-card/40 border-t border-slate-800/80 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-[10px] text-slate-500 font-medium">
            ArenaFlow — Smart Stadiums & Tournament Operations (FIFA World Cup 2026™ Vertical Submission)
          </p>
          <p className="text-[10px] text-slate-500 flex items-center gap-1">
            Made with <Heart size={10} className="text-stadium-danger fill-stadium-danger" /> for tournament organizers
          </p>
        </div>
      </footer>
    </div>
  );
}
