import { ArrowLeft, Clock, Activity, Download } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { useEffect, useState, useRef } from "react"

const mockLogs = [
  { type: "info", text: "Initializing sandbox environment [agent-research]..." },
  { type: "info", text: "Pulling required base image (ubuntu:22.04)..." },
  { type: "success", text: "Container started successfully. ID: c82f9d12a" },
  { type: "info", text: "Mounting workspace volumes..." },
  { type: "info", text: "Starting agent execution..." },
  { type: "cmd", text: "$ python main.py --task 'analyze data'" },
  { type: "output", text: "Loading dataset entries (count=15420)..." },
  { type: "output", text: "Connecting to vector db..." },
  { type: "success", text: "Connected." },
  { type: "output", text: "Processing batch 1/15..." },
  { type: "output", text: "Processing batch 2/15..." },
  { type: "warning", text: "Rate limit approach near for provider=openai" },
  { type: "output", text: "Processing batch 3/15..." },
  { type: "error", text: "Fatal: Disconnected from vector db. Heartbeat failed." },
  { type: "error", text: "Stack trace: \n  File \"main.py\", line 42, in process_batch\n    db.insert(...) \nTimeoutError: connection lost" },
  { type: "info", text: "Execution aborted. Container stopped." },
]

export default function RunDetails() {
  const { runId } = useParams()
  const [logs, setLogs] = useState([])
  const terminalEndRef = useRef(null)

  // Simulate streaming
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setLogs(prev => [...prev, mockLogs[i]])
      i++
      if (i >= mockLogs.length) clearInterval(interval)
    }, 400) // 400ms per log entry
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  return (
    <div className="flex flex-col h-full h-[calc(100vh-4rem)]">
      {/* Header Panel */}
      <div className="shrink-0 p-4 border-b border-border bg-card/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/history" className="p-2 hover:bg-secondary rounded-md transition-colors text-muted-foreground mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold font-mono tracking-tight">{runId || 'run-abc1234'}</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-500/10 text-rose-500 border border-rose-500/20">
                Failed
              </span>
            </div>
            <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 1 hour ago</span>
              <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> Duration: 45s</span>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-border rounded-md hover:bg-secondary/50 transition-colors">
          <Download className="h-4 w-4" /> Export Logs
        </button>
      </div>

      {/* Terminal View */}
      <div className="flex-1 bg-black p-4 md:p-6 overflow-y-auto font-mono text-sm leading-relaxed overflow-x-auto relative">
        <div className="mb-4 text-muted-foreground border-b border-neutral-800 pb-2">
          Lanora Logs Viewer v1.0.0
          <br/>
          Listening for events...
        </div>

        <div className="space-y-1 pb-10 min-w-max">
          {logs.map((log, i) => (
            <div key={i} className={`
              ${log.type === 'error' ? 'text-rose-400 font-medium' : ''}
              ${log.type === 'success' ? 'text-emerald-400 font-medium' : ''}
              ${log.type === 'warning' ? 'text-amber-400' : ''}
              ${log.type === 'cmd' ? 'text-blue-400 font-bold mt-4' : ''}
              ${log.type === 'output' ? 'text-neutral-300' : ''}
              ${log.type === 'info' ? 'text-neutral-400' : ''}
            `}>
              <span className="text-neutral-600 mr-4 select-none">
                {new Date().toISOString().split('T')[1].slice(0,12)}
              </span>
              <span className="whitespace-pre-wrap">{log.text}</span>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  )
}
