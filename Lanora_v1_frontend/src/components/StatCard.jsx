
export default function StatCard({ title, value, subText = "", Icon, iconColor = "text-neutral-400" }) {
  return (
    <div className="bg-[#111111] rounded-xl border border-white/5 p-6 flex flex-col justify-between">
      <span className="text-xs font-medium text-neutral-400 flex items-center gap-2">
        {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
        {title}
      </span>
      <div className="mt-4">
        <div className="text-2xl font-bold text-white">{value}</div>
        {subText && (
          <div className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wider font-semibold">
            {subText}
          </div>
        )}
      </div>
    </div>
  )
}
