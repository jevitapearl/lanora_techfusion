import { useState } from "react"
import { Activity, XCircle, CheckCircle } from "lucide-react"
import LogTerminalModal from "./LogTerminalModal"

export default function RunTable({ runs }) {
  const [activeRun, setActiveRun] = useState(null);

  if (!runs || runs.length === 0) return (
    <div className="p-8 text-center text-neutral-500 text-sm">No data available.</div>
  );

  return (
    <div className="bg-[#111111] border border-white/5 rounded-xl flex-1 overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#111111] border-b border-white/5 text-neutral-400 text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Run ID</th>
              <th className="px-6 py-4 font-medium">Agent / Sandbox</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Started At</th>
              <th className="px-6 py-4 font-medium">Runtime</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-neutral-300">
            {runs.map((run, i) => {
              // Status formatting logic
              const isRunning = run.status === "Running"
              const isTerminated = run.status === "Terminated"

              return (
                <tr key={run.id || i} className="hover:bg-white/[0.02] cursor-default">
                  <td className="px-6 py-4 font-mono text-sm text-emerald-500 underline decoration-emerald-500/30 underline-offset-4 pointer-events-none">
                    run-{run.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{run.agent || run.name || "-"}</td>
                  <td className="px-6 py-4">
                    {isRunning && (
                      <span className="text-amber-500 text-[10px] font-bold px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/20 inline-flex items-center gap-1.5 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> {run.status}
                      </span>
                    )}
                    {isTerminated && (
                      <span className="text-rose-500 text-[10px] font-bold px-2 py-0.5 bg-rose-500/10 rounded border border-rose-500/20 inline-flex items-center gap-1.5 w-fit">
                         <XCircle className="w-3 h-3"/> {run.status}
                      </span>
                    )}
                    {!isRunning && !isTerminated && (
                      <span className="text-neutral-400 text-[10px] font-bold px-2 py-0.5 bg-white/5 rounded border border-white/10 inline-flex items-center gap-1.5 w-fit">
                        {run.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-neutral-500 text-xs">{run.createdAt || run.started || "-"}</td>
                  <td className="px-6 py-4 text-neutral-500 text-xs">{run.runtime || run.duration || "-"}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setActiveRun(run)}
                      className="text-[11px] font-bold tracking-wider px-3 py-1.5 border border-white/10 rounded-md hover:bg-white/10 transition-colors text-white uppercase"
                    >
                      Stream Logs
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {activeRun && (
        <LogTerminalModal 
          run={activeRun} 
          onClose={() => setActiveRun(null)} 
        />
      )}
    </div>
  )
}
