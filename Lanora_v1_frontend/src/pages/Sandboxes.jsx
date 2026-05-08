import { useAppData } from "../hooks/useAppData"
import SandboxCard from "../components/SandboxCard"
import StatCard from "../components/StatCard"
import { Box, HardDrive, Clock } from "lucide-react"

export default function Sandboxes() {
  const { data, loading } = useAppData();

  const stats = data?.sandboxes?.stats ?? { created: "--", runtime: "--", storage: "--" };
  const history = data?.sandboxes?.history ?? [];

  return (
    <div className="flex flex-col h-full animate-fade-in-up" style={{ animationDuration: '0.4s' }}>
      <div className="flex justify-between items-start mb-8 pb-6 border-b border-white/5">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Sandboxes</h3>
          <p className="text-neutral-500 text-sm mt-1">Manage your isolated agent environments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Created Sandboxes" value={loading ? "--" : stats.created} Icon={Box} />
        <StatCard title="Total Runtime" value={loading ? "--" : stats.runtime} Icon={Clock} />
        <StatCard title="Storage Used" value={loading ? "--" : stats.storage} Icon={HardDrive} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {history.length > 0 ? (
          history.map((sb, i) => (
            <SandboxCard
              key={sb.id || i}
              name={sb.name}
              status={sb.status}
              started={sb.started}
              duration={sb.duration}
            />
          ))
        ) : (
          <div className="col-span-3 py-12 text-center border border-white/5 rounded-xl bg-white/[0.02]">
            <p className="text-neutral-500 text-sm">{loading ? "Loading sandboxes..." : "No sandboxes available"}</p>
          </div>
        )}
      </div>
    </div>
  )
}
