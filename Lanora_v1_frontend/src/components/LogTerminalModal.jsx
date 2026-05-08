import { useState, useEffect, useRef } from "react";
import { X, Terminal as TerminalIcon } from "lucide-react";



export default function LogTerminalModal({ run, onClose }) {
  const [logs, setLogs] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const abortController = new AbortController();

    const startStreaming = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const res = await fetch(`http://localhost:5000/api/test-agent-stream/${run.id}`, {
          headers: { "Authorization": `Bearer ${token}` },
          signal: abortController.signal
        });
        
        if (!res.ok) {
          throw new Error("Failed to connect to log stream.");
        }
        
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            setIsLive(false);
            break;
          }
          
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim() !== '');
          if (lines.length > 0) {
            setLogs(prev => [...prev, ...lines]);
          }
        }
      } catch (e) {
        if (e.name !== 'AbortError') {
          console.error("Streaming error:", e);
          setIsLive(false);
          setLogs(prev => [...prev, "[ERROR] Connection to live log stream failed."]);
        }
      }
    };

    startStreaming();

    return () => {
      abortController.abort();
    };
  }, [run.id]);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm">
      <div className="bg-[#0c0c0c] border border-white/10 rounded-xl shadow-2xl w-full max-w-4xl h-full max-h-[80vh] flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Terminal Header */}
        <div className="flex justify-between items-center bg-[#151515] px-4 py-3 border-b border-white/10 rounded-t-xl shrink-0">
          <div className="flex items-center gap-3">
            <TerminalIcon className="w-5 h-5 text-emerald-500" />
            <div>
              <h3 className="text-white font-mono font-bold text-sm leading-tight">run-{run.id}</h3>
              <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">{run.agent || run.name || "Unknown Agent"}</p>
            </div>
            
            <div className="ml-4 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{isLive ? 'Receiving Broadcast' : 'Connection Closed'}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Terminal Output */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 font-mono text-sm leading-relaxed"
        >
          {logs.length === 0 ? (
            <div className="text-neutral-500 flex items-center gap-2">
              <span className="animate-pulse">_</span> Requesting server logstream...
            </div>
          ) : (
            logs.map((line, idx) => (
              <div key={idx} className="mb-1 text-neutral-300 break-all">
                {line.includes("[INFO]") && <span className="text-sky-400 font-bold mr-2">[INFO]</span>}
                {line.includes("[WARN]") && <span className="text-amber-400 font-bold mr-2">[WARN]</span>}
                {line.includes("[ERROR]") && <span className="text-rose-500 font-bold mr-2">[ERROR]</span>}
                {line.includes("[DEBUG]") && <span className="text-purple-400 font-bold mr-2">[DEBUG]</span>}
                <span className="opacity-90">{line.replace(/\[(INFO|WARN|ERROR|DEBUG)\]/g, '')}</span>
              </div>
            ))
          )}
          {isLive && logs.length > 0 && (
             <div className="mt-2 text-neutral-500 animate-pulse">_</div>
          )}
        </div>
      </div>
    </div>
  );
}
