import React, { useState } from 'react';
import { Sparkles, Send, BrainCircuit, Activity, ChevronRight, FileText } from 'lucide-react';
import Button from '../../components/common/Button';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello, Dr. Sharma. I am your TrialOrbit Intelligence Assistant. How can I help you analyze the clinical data today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newMsg = { role: 'user', text: input };
    setMessages([...messages, newMsg]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      let reply = "I can analyze that. Based on current trends across 5 sites, the compliance rate is 94.2%.";
      if (newMsg.text.toLowerCase().includes('recruitment')) {
        reply = "Site S-05 (Goa) is currently 28% below the protocol recruitment trajectory. I recommend reallocating 20 candidate slots to Site S-03 (Gujarat) which is operating at 110% velocity.";
      } else if (newMsg.text.toLowerCase().includes('safety')) {
        reply = "There is 1 unresolved SAE (SAE-204) at Site S-01. Pharmacovigilance review is required within 24 hours to comply with regulatory timelines.";
      }
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    }, 1200);
  };

  return (
    <div className="page-container h-[calc(100vh-64px)] flex flex-col">
      <div className="page-header shrink-0">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Sparkles className="text-accent" /> 
            AI Intelligence Assistant
          </h1>
          <p className="page-subtitle">Natural language queries for study KPIs, risk anomalies, and protocol analytics</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-full min-h-0 overflow-hidden">
        
        {/* Chat Area */}
        <div className="flex-1 card flex flex-col min-h-0 relative border border-primary-200">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-4 rounded-xl shadow-sm text-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-primary-50 dark:bg-slate-800 border border-primary-100 rounded-tl-none'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2 text-primary font-bold">
                      <BrainCircuit size={16} /> TrialOrbit AI
                    </div>
                  )}
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-subtle bg-white dark:bg-slate-900 shrink-0">
            <form onSubmit={handleSend} className="flex gap-2">
              <input 
                type="text" 
                className="form-input flex-1 bg-gray-50 focus:bg-white" 
                placeholder="Ask about trial progress, recruitment risks, or safety compliance..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button type="submit" variant="primary" icon={<Send size={16} />}>Ask</Button>
            </form>
          </div>
        </div>

        {/* Recommended Prompts Area */}
        <div className="w-full md:w-80 flex flex-col gap-4 shrink-0 overflow-y-auto">
          <div className="card p-4 bg-gradient-to-br from-primary-900 to-slate-900 text-white border-0">
            <h3 className="font-bold flex items-center gap-2 mb-2"><Activity size={18} className="text-accent"/> Predicted Risk Alerts</h3>
            <div className="text-sm bg-black/20 p-3 rounded border border-white/10 mb-2">
              <span className="text-accent font-bold">High:</span> Site S-04 missing 2 consecutive monitoring visits.
            </div>
            <div className="text-sm bg-black/20 p-3 rounded border border-white/10">
              <span className="text-warning font-bold">Medium:</span> 15% increase in protocol deviations at Site S-02.
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-bold text-sm text-secondary mb-3 uppercase tracking-wider">Suggested Queries</h3>
            <div className="space-y-2">
              <button onClick={() => setInput('Summarize recruitment performance across all sites.')} className="w-full text-left p-3 rounded border border-subtle hover:border-primary hover:bg-primary-50 dark:hover:bg-slate-800 transition-colors text-sm flex justify-between items-center group">
                Summarize recruitment performance across all sites.
                <ChevronRight size={14} className="text-transparent group-hover:text-primary" />
              </button>
              <button onClick={() => setInput('Are there any critical safety alerts pending?')} className="w-full text-left p-3 rounded border border-subtle hover:border-primary hover:bg-primary-50 dark:hover:bg-slate-800 transition-colors text-sm flex justify-between items-center group">
                Are there any critical safety alerts pending?
                <ChevronRight size={14} className="text-transparent group-hover:text-primary" />
              </button>
              <button onClick={() => setInput('Generate a CDISC mapping status report.')} className="w-full text-left p-3 rounded border border-subtle hover:border-primary hover:bg-primary-50 dark:hover:bg-slate-800 transition-colors text-sm flex justify-between items-center group">
                Generate a CDISC mapping status report.
                <ChevronRight size={14} className="text-transparent group-hover:text-primary" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIAssistant;
