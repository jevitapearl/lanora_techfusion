import { Box, Play, XCircle, Terminal as TerminalIcon } from "lucide-react"

export default function SandboxCard({ name, status, runtime, started, duration }) {
  const isRunning = status === "Running"

  return (
    <div className="bg-[#111111] border border-white/5 rounded-xl p-6 group flex flex-col justify-between h-[180px] hover:border-white/10 transition-colors cursor-pointer relative">
      <div className="flex justify-between items-start">
        <Box className={`w-8 h-8 ${isRunning ? "text-amber-500/80" : "text-neutral-500/80"}`} />
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
          isRunning 
            ? "text-amber-500 bg-amber-500/10 border-amber-500/20" 
            : "text-neutral-500 bg-white/5 border-white/10"
        }`}>
          {status}
        </span>
      </div>
      <div>
        <h4 className="text-white font-bold text-[15px]">{name}</h4>
        <div className="text-[11px] font-medium text-neutral-500 mt-1">Runtime: {runtime || "Native"}</div>
        <div className="text-[10px] text-neutral-400 mt-4 bg-white/5 w-fit px-2 py-1 rounded font-medium border border-white/5">
          {started ? `Started ${started}` : "Created"}
        </div>
      </div>
      <div className="absolute bottom-5 right-5 flex gap-2">
        {!isRunning && (
          <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded border border-white/5 hover:bg-white/10 text-emerald-500" title="Start Sandbox">
             <Play className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    </div>
  )
}
