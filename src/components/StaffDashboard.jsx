import React, { useState, useEffect } from 'react';
import { 
  Activity, AlertTriangle, Users, HelpCircle, MapPin, 
  RefreshCw, ShieldAlert, Cpu, Sparkles, PlusCircle, CheckCircle, Clock 
} from 'lucide-react';
import { getOperationsMitigationPlan } from '../services/gemini';

export default function StaffDashboard() {
  const [gates, setGates] = useState([
    { name: 'Gate A (North Entrance)', flow: 'Normal', capacity: 34, status: 'safe' },
    { name: 'Gate B (Transit Plaza)', flow: 'Moderate', capacity: 58, status: 'warning' },
    { name: 'Gate C (East Boulevard)', flow: 'Critical Bottleneck', capacity: 92, status: 'danger' },
    { name: 'Gate D (Rideshare Loop)', flow: 'Low', capacity: 18, status: 'safe' },
  ]);

  const [incidents, setIncidents] = useState([
    { id: 1, gate: 'Gate C', type: 'Crowd Congestion', density: '92% Capacity', description: 'Heavy backups at biometric screening lanes due to scanner calibration issue.', status: 'Active', time: '10m ago' },
    { id: 2, gate: 'Transit Plaza', type: 'Bus Transit Delay', density: 'Moderate', description: 'Light rail shuttle temporarily delayed by traffic. Volunteer dispatch needed.', status: 'Active', time: '23m ago' },
  ]);

  const [selectedIncident, setSelectedIncident] = useState(incidents[0]);
  const [mitigationPlan, setMitigationPlan] = useState('');
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [newGate, setNewGate] = useState('Gate A');
  const [newType, setNewType] = useState('Congestion');
  const [newDesc, setNewDesc] = useState('');
  const [stats, setStats] = useState({ totalFans: 68420, gateAverage: '50.5s', activeAlerts: 2 });

  useEffect(() => {
    // Generate initial plan for the default selected incident
    if (selectedIncident) {
      handleGeneratePlan(selectedIncident);
    }
  }, [selectedIncident]);

  const handleGeneratePlan = async (incident) => {
    setIsLoadingPlan(true);
    setMitigationPlan('');
    try {
      const plan = await getOperationsMitigationPlan(incident);
      setMitigationPlan(plan);
    } catch (e) {
      setMitigationPlan('Error generating response plan. Please verify API configuration.');
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const handleAddIncident = (e) => {
    e.preventDefault();
    if (!newDesc.trim()) return;

    const incident = {
      id: Date.now(),
      gate: newGate,
      type: newType,
      density: 'Critical',
      description: newDesc,
      status: 'Active',
      time: 'Just now'
    };

    const updated = [incident, ...incidents];
    setIncidents(updated);
    setSelectedIncident(incident);
    setStats(prev => ({ ...prev, activeAlerts: prev.activeAlerts + 1 }));
    
    // Simulate updating the gates' capacity
    setGates(prev => prev.map(g => {
      if (g.name.includes(newGate)) {
        return { ...g, flow: 'Critical Bottleneck', capacity: 95, status: 'danger' };
      }
      return g;
    }));

    setNewDesc('');
  };

  const resolveIncident = (id) => {
    const inc = incidents.find(i => i.id === id);
    if (!inc) return;

    setIncidents(prev => prev.filter(i => i.id !== id));
    setStats(prev => ({ ...prev, activeAlerts: Math.max(0, prev.activeAlerts - 1) }));
    
    // Restore gate status
    setGates(prev => prev.map(g => {
      if (g.name.includes(inc.gate)) {
        return { ...g, flow: 'Normal', capacity: 40, status: 'safe' };
      }
      return g;
    }));

    if (selectedIncident?.id === id) {
      setSelectedIncident(null);
      setMitigationPlan('');
    }
  };

  const simulateTick = () => {
    // Randomize metrics slightly to show dynamic updates
    setStats(prev => ({
      totalFans: prev.totalFans + Math.floor(Math.random() * 20) - 5,
      gateAverage: `${(45 + Math.random() * 15).toFixed(1)}s`,
      activeAlerts: incidents.length
    }));
  };

  useEffect(() => {
    const timer = setInterval(simulateTick, 4000);
    return () => clearInterval(timer);
  }, [incidents]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Metrics Row */}
      <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel rounded-xl p-5 flex items-center justify-between border-l-4 border-l-stadium-accent">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider">Total Stadium Attendees</p>
            <h3 className="text-2xl font-bold text-slate-100 mt-1">{stats.totalFans.toLocaleString()}</h3>
            <p className="text-stadium-pitch text-xs font-semibold mt-2 flex items-center gap-1">
              <span>● Live Match Day</span>
            </p>
          </div>
          <div className="p-3 bg-stadium-accent/10 rounded-lg text-stadium-accent">
            <Users size={24} />
          </div>
        </div>

        <div className="glass-panel rounded-xl p-5 flex items-center justify-between border-l-4 border-l-stadium-pitch">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider">Avg. Security Scan Wait</p>
            <h3 className="text-2xl font-bold text-slate-100 mt-1">{stats.gateAverage}</h3>
            <p className="text-slate-400 text-xs mt-2">Optimal target &lt; 60s</p>
          </div>
          <div className="p-3 bg-stadium-pitch/10 rounded-lg text-stadium-pitch">
            <Clock size={24} />
          </div>
        </div>

        <div className="glass-panel rounded-xl p-5 flex items-center justify-between border-l-4 border-l-stadium-danger">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider">Active Operations Alerts</p>
            <h3 className="text-2xl font-bold text-slate-100 mt-1">{stats.activeAlerts}</h3>
            <p className="text-stadium-danger text-xs font-semibold mt-2 flex items-center gap-1">
              <span>● Immediate Action Recommended</span>
            </p>
          </div>
          <div className="p-3 bg-stadium-danger/10 rounded-lg text-stadium-danger">
            <ShieldAlert size={24} />
          </div>
        </div>
      </div>

      {/* Main Flow Grid & Alert Feed */}
      <div className="lg:col-span-8 space-y-6">
        {/* Gate Capacity & Visual Simulation */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Activity className="text-stadium-accent" size={20} />
              Live Gate Flow & Capacity Monitor
            </h2>
            <button 
              onClick={() => {
                setGates(prev => prev.map(g => ({ ...g, capacity: Math.floor(Math.random() * 40) + 30 })));
              }}
              className="text-xs text-stadium-accent hover:text-white flex items-center gap-1 transition-colors"
            >
              <RefreshCw size={12} />
              Re-simulate sensors
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gates.map((gate, i) => (
              <div key={i} className="bg-stadium-dark/60 border border-slate-800 rounded-lg p-4 relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-slate-200 text-sm">{gate.name}</h4>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-1 uppercase ${
                      gate.status === 'danger' ? 'bg-stadium-danger/20 text-stadium-danger' : 
                      gate.status === 'warning' ? 'bg-stadium-warning/20 text-stadium-warning' : 
                      'bg-stadium-pitch/20 text-stadium-pitch'
                    }`}>
                      {gate.flow}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">{gate.capacity}%</span>
                </div>

                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mt-3">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      gate.status === 'danger' ? 'bg-stadium-danger' : 
                      gate.status === 'warning' ? 'bg-stadium-warning' : 
                      'bg-stadium-pitch'
                    }`}
                    style={{ width: `${gate.capacity}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Stadium Virtual Pitch / Arena Layout Map Representation */}
          <div className="mt-6 border border-slate-800 rounded-lg bg-stadium-dark/40 p-4 flex flex-col items-center justify-center">
            <p className="text-xs text-slate-400 mb-3 uppercase tracking-widest font-semibold">Stadium Layout Congestion Overview</p>
            <div className="relative w-full max-w-md aspect-video bg-stadium-card rounded-lg border-2 border-slate-700 overflow-hidden flex items-center justify-center shadow-inner">
              {/* Field */}
              <div className="w-2/3 h-2/3 border border-stadium-pitch/40 rounded flex items-center justify-center relative">
                <div className="absolute inset-0 bg-stadium-pitch/5 pulse-glow-pitch" />
                <div className="w-10 h-10 rounded-full border border-stadium-pitch/40" />
                <div className="absolute left-0 top-0 bottom-0 w-px bg-stadium-pitch/30" />
                <div className="absolute right-0 top-0 bottom-0 w-px bg-stadium-pitch/30" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-stadium-pitch/40" />
              </div>

              {/* Renders Gates */}
              <div className="absolute top-2 left-4 flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-stadium-pitch shadow-glow" />
                <span className="text-[9px] text-slate-400 font-semibold mt-1">Gate A</span>
              </div>
              <div className="absolute top-1/2 left-2 -translate-y-1/2 flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-stadium-warning animate-pulse" />
                <span className="text-[9px] text-slate-400 font-semibold">Gate B</span>
              </div>
              <div className="absolute bottom-2 right-4 flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-stadium-pitch" />
                <span className="text-[9px] text-slate-400 font-semibold mt-1">Gate D</span>
              </div>
              
              {/* Bottleneck indicator */}
              <div className="absolute right-3 top-1/3 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-stadium-danger animate-ping absolute opacity-70" />
                <div className="w-4 h-4 rounded-full bg-stadium-danger relative flex items-center justify-center font-bold text-[8px]">!</div>
                <span className="text-[10px] text-stadium-danger font-bold bg-stadium-dark/95 border border-stadium-danger/35 px-1 py-0.5 rounded shadow">Gate C Alert</span>
              </div>
            </div>
          </div>
        </div>

        {/* Raise New Incident / Report Triage Form */}
        <div className="glass-panel rounded-xl p-6">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-4">
            <PlusCircle className="text-stadium-accent" size={20} />
            Log Operational Incident (Manual Dispatch)
          </h2>
          <form onSubmit={handleAddIncident} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Target Gate/Location</label>
              <select 
                value={newGate} 
                onChange={(e) => setNewGate(e.target.value)}
                className="w-full bg-stadium-dark border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-stadium-accent"
              >
                <option value="Gate A">Gate A (North Entrance)</option>
                <option value="Gate B">Gate B (Transit Plaza)</option>
                <option value="Gate C">Gate C (East Boulevard)</option>
                <option value="Gate D">Gate D (Rideshare Loop)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Incident Type</label>
              <select 
                value={newType} 
                onChange={(e) => setNewType(e.target.value)}
                className="w-full bg-stadium-dark border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-stadium-accent"
              >
                <option value="Congestion / Bottleneck">Congestion / Bottleneck</option>
                <option value="Transit Delay">Transit Delay</option>
                <option value="Medical Assistance">Medical Assistance</option>
                <option value="Access Ramp Blocked">Access Ramp Blocked</option>
                <option value="Signage Outage">Signage Outage</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Incident Details</label>
              <textarea 
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="E.g., Ticket scanners down at row 4, resulting in crowd buildup of approx 200 people. Need technician and queue control..."
                rows={3}
                className="w-full bg-stadium-dark border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-stadium-accent"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button 
                type="submit"
                className="px-4 py-2.5 bg-stadium-accent hover:bg-stadium-accent/80 text-stadium-dark font-bold text-xs rounded-lg flex items-center gap-2 transition-all"
              >
                <Sparkles size={14} />
                Generate and Triage Incident
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Triage & Co-Pilot Action Center */}
      <div className="lg:col-span-4 space-y-6">
        {/* Alerts List */}
        <div className="glass-panel rounded-xl p-6">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-4">
            <AlertTriangle className="text-stadium-warning animate-pulse" size={20} />
            Alert Triage Feed
          </h2>

          {incidents.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <CheckCircle className="mx-auto text-stadium-pitch mb-2" size={32} />
              <p className="text-sm">All gates and pathways are green.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {incidents.map((incident) => (
                <div 
                  key={incident.id} 
                  onClick={() => setSelectedIncident(incident)}
                  className={`p-4 rounded-lg cursor-pointer transition-all border ${
                    selectedIncident?.id === incident.id 
                      ? 'bg-stadium-accent/10 border-stadium-accent' 
                      : 'bg-stadium-dark/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-stadium-accent uppercase tracking-wider">{incident.gate}</span>
                    <span className="text-[10px] text-slate-500">{incident.time}</span>
                  </div>
                  <h4 className="font-bold text-slate-200 text-sm mt-1">{incident.type}</h4>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{incident.description}</p>
                  
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800/60">
                    <span className="text-[10px] font-semibold text-stadium-danger bg-stadium-danger/10 px-2 py-0.5 rounded">
                      {incident.density}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        resolveIncident(incident.id);
                      }}
                      className="text-xs text-stadium-pitch hover:underline flex items-center gap-1"
                    >
                      <CheckCircle size={12} />
                      Resolve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* GenAI Operations Co-Pilot Output */}
        <div className="glass-panel-glow rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-stadium-accent">
            <Cpu size={120} />
          </div>

          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-2 relative">
            <Sparkles className="text-stadium-accent animate-pulse" size={20} />
            GenAI Operations Co-Pilot
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Select an alert on the triage feed to generate dynamic stadium mitigation plans.
          </p>

          {selectedIncident ? (
            <div className="relative space-y-4">
              <div className="bg-stadium-dark/90 border border-slate-800 rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Selected Target</p>
                <p className="text-sm font-bold text-slate-200 mt-1">{selectedIncident.gate} — {selectedIncident.type}</p>
              </div>

              {isLoadingPlan ? (
                <div className="py-8 flex flex-col items-center justify-center text-slate-400">
                  <div className="w-8 h-8 rounded-full border-2 border-t-stadium-accent border-slate-700 animate-spin mb-3" />
                  <p className="text-xs">Generating tactical mitigation strategies...</p>
                </div>
              ) : (
                <div className="text-xs leading-relaxed text-slate-300 space-y-2 whitespace-pre-line max-h-[300px] overflow-y-auto pr-1">
                  {mitigationPlan}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 border border-dashed border-slate-800 rounded-lg">
              <HelpCircle className="mx-auto text-slate-600 mb-2" size={28} />
              <p className="text-xs">No active alert selected to query Co-Pilot.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
