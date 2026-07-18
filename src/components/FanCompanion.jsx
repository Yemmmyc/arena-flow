import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Compass, HelpCircle, Map, MessageSquare, 
  Sparkles, ShieldAlert, Globe, ChevronRight, Bus, Compass as CompassIcon, Accessibility 
} from 'lucide-react';
import { getFanConciergeResponse } from '../services/gemini';

export default function FanCompanion() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to FIFA World Cup 2026™! I am your ArenaFlow Concierge. Ask me anything about stadium gates, accessibility, transportation options, or rules.", sender: 'ai' }
  ]);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState('en');
  const [isTyping, setIsTyping] = useState(false);
  const [activeMapFeature, setActiveMapFeature] = useState('Overview');
  const chatEndRef = useRef(null);

  const mapHotspots = {
    Overview: "Select a zone on the map to display wayfinding, elevator access points, and nearest concession stands.",
    'Concourse L1': "Gate A & Gate B entrance level. Features: Main Ticketing Office, Accessibility ramps, sensory room in Sec 114, first-aid center, and 14 Cashless concession stations.",
    'Concourse L2': "Suite Levels & Premium Seating access. Elevator access from Section 102. Escalators available at West and East Plazas.",
    'Gate C Plaza': "Gate C entry point. Main transit shuttle pick-up station, taxi loop, and pedestrian walkway leading to the Express Metro station.",
    'Section 108-112': "Family friendly seating zone. Closest to standard and gender-neutral restrooms. Stroller parking located at Sec 110."
  };

  const sampleQuestions = [
    { title: "♿ Accessible elevators?", q: "Where are the closest accessible elevators and wheelchair seating lanes?" },
    { title: "🚇 Get to train?", q: "How do I walk to the Metro/Train Station from Gate B?" },
    { title: "🎒 Bag policy?", q: "What is the stadium bag size policy for safety checkups?" },
    { title: "Halal/Vegan food?", q: "Where can I find halal or vegan food options in the concourses?" }
  ];

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    let welcome = "Welcome to FIFA World Cup 2026™! I am your ArenaFlow Concierge. Ask me anything about stadium gates, accessibility, transportation options, or rules.";
    if (langCode === 'es') {
      welcome = "¡Bienvenido a la Copa Mundial de la FIFA 2026™! Soy tu asistente ArenaFlow. Pregúntame sobre accesos, accesibilidad, transporte o normas del estadio.";
    } else if (langCode === 'fr') {
      welcome = "Bienvenue à la Coupe du Monde de la FIFA 2026™ ! Je suis votre Concierge ArenaFlow. Posez-moi vos questions sur l'accessibilité, les transports ou le règlement.";
    }
    setMessages([{ id: Date.now(), text: welcome, sender: 'ai' }]);
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    setMessages(prev => [...prev, { id: Date.now(), text: query, sender: 'user' }]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await getFanConciergeResponse(query, language);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'ai' }]);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "I apologize, there was an issue communicating with the AI. Please verify your settings or internet connection.", sender: 'ai' }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      
      {/* Interactive Concierge Chat Panel */}
      <div className="md:col-span-7 flex flex-col glass-panel rounded-xl h-[600px] overflow-hidden">
        
        {/* Chat Header */}
        <div className="bg-stadium-card p-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stadium-accent/10 border border-stadium-accent flex items-center justify-center text-stadium-accent">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">ArenaFlow AI Companion</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-stadium-pitch animate-pulse" />
                <span className="text-[10px] text-slate-400 font-medium">GenAI Online (Multilingual)</span>
              </div>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-stadium-dark/80 px-2 py-1 rounded-lg border border-slate-700">
            <Globe size={14} className="text-slate-400" />
            <select 
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              aria-label="Select Concierge Language"
              className="bg-transparent text-[11px] font-bold text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="en" className="bg-stadium-card">English (EN)</option>
              <option value="es" className="bg-stadium-card">Español (ES)</option>
              <option value="fr" className="bg-stadium-card">Français (FR)</option>
            </select>
          </div>
        </div>

        {/* Message Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stadium-dark/40">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-stadium-accent text-stadium-dark font-medium rounded-tr-none shadow-glow'
                  : 'bg-stadium-card border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-stadium-card border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-stadium-card/30 border-t border-slate-800/80 overflow-x-auto flex gap-2 whitespace-nowrap scrollbar-none">
          {sampleQuestions.map((q, idx) => (
            <button 
              key={idx}
              onClick={() => handleSendMessage(q.q)}
              className="text-[10px] bg-stadium-card hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors"
            >
              <HelpCircle size={10} className="text-stadium-accent" />
              {q.title}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-stadium-card border-t border-slate-800 flex gap-2">
          <input 
            id="input-chat-query"
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            aria-label="Ask ArenaFlow Concierge"
            placeholder={
              language === 'es' ? "Pregunta al asistente de ArenaFlow..." : 
              language === 'fr' ? "Demander au concierge ArenaFlow..." :
              "Ask ArenaFlow Concierge..."
            }
            className="flex-1 bg-stadium-dark border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-stadium-accent placeholder:text-slate-500"
          />
          <button 
            id="btn-send-chat"
            onClick={() => handleSendMessage()}
            aria-label="Send message"
            className="bg-stadium-accent hover:bg-stadium-accent/80 text-stadium-dark rounded-xl px-4 flex items-center justify-center transition-all shadow-glow"
          >
            <Send size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Interactive Map & Transport Info */}
      <div className="md:col-span-5 space-y-6">
        
        {/* Navigation / Wayfinding Map */}
        <div className="glass-panel rounded-xl p-5">
          <h3 className="font-bold text-slate-100 text-sm mb-3 flex items-center gap-2">
            <Map className="text-stadium-accent" size={16} />
            Interactive Stadium Wayfinding
          </h3>

          {/* Interactive Layout Hotspots */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {Object.keys(mapHotspots).map((spot) => (
              <button 
                key={spot}
                onClick={() => setActiveMapFeature(spot)}
                className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                  activeMapFeature === spot 
                    ? 'bg-stadium-accent text-stadium-dark shadow-glow' 
                    : 'bg-stadium-dark hover:bg-slate-800 text-slate-400'
                }`}
              >
                {spot}
              </button>
            ))}
          </div>

          <div className="bg-stadium-dark/70 rounded-lg p-3 border border-slate-800 text-xs text-slate-300 min-h-[100px] flex flex-col justify-between">
            <div>
              <p className="font-bold text-stadium-accent text-xs mb-1 uppercase tracking-wider">{activeMapFeature}</p>
              <p className="leading-relaxed">{mapHotspots[activeMapFeature]}</p>
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-slate-800/80">
              <button 
                onClick={() => handleSendMessage(`Tell me more about accessing the area of ${activeMapFeature}`)}
                className="text-[10px] font-semibold text-stadium-accent hover:underline flex items-center gap-0.5"
              >
                Ask Assistant about this zone <ChevronRight size={10} />
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Transit Board */}
        <div className="glass-panel rounded-xl p-5">
          <h3 className="font-bold text-slate-100 text-sm mb-3 flex items-center gap-2">
            <Bus className="text-stadium-pitch" size={16} />
            Match Day Shuttle & Public Transit
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center bg-stadium-dark/50 border border-slate-800 p-2.5 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-stadium-accent/10 border border-stadium-accent/20 flex items-center justify-center text-stadium-accent">
                  <span className="text-xs font-bold font-mono">M1</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">Express Metro Station</p>
                  <p className="text-[10px] text-slate-400">Leaves from Plaza East</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-stadium-pitch bg-stadium-pitch/10 px-2 py-0.5 rounded">Every 4m</span>
                <p className="text-[9px] text-slate-500 mt-1">Normal service</p>
              </div>
            </div>

            <div className="flex justify-between items-center bg-stadium-dark/50 border border-slate-800 p-2.5 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-stadium-purple/10 border border-stadium-purple/20 flex items-center justify-center text-stadium-purple">
                  <span className="text-xs font-bold font-mono">SH</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">Downtown Fan Fest Shuttle</p>
                  <p className="text-[10px] text-slate-400">Leaves from West Plaza</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-stadium-warning bg-stadium-warning/10 px-2 py-0.5 rounded">Delay 8m</span>
                <p className="text-[9px] text-slate-500 mt-1">Road traffic</p>
              </div>
            </div>

            <div className="flex justify-between items-center bg-stadium-dark/50 border border-slate-800 p-2.5 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-stadium-pitch/10 border border-stadium-pitch/20 flex items-center justify-center text-stadium-pitch">
                  <Accessibility size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">Accessibility Cart Shuttle</p>
                  <p className="text-[10px] text-slate-400">Blue Lot to Gate A</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-stadium-pitch bg-stadium-pitch/10 px-2 py-0.5 rounded">On Demand</span>
                <p className="text-[9px] text-slate-500 mt-1">Request via App Chat</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
