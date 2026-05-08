export default function ResourceCard({ title, value }) {
  return (
    <div className="bg-[#111111] border border-white/5 rounded-[4px] flex flex-col items-center justify-center aspect-[5/7] max-h-[350px] w-full hover:border-white/10 transition-colors cursor-default shadow-sm relative">
      {/* Container spacing loosely matched to the screenshot's portrait proportions */}
      <h4 className="text-lg text-white font-bold absolute top-[20%] text-center px-4 w-full">
        {title}
      </h4>
      <p className="text-2xl text-emerald-400 font-bold tracking-wide absolute top-[55%] text-center px-4 w-full">
        {value}
      </p>
    </div>
  )
}
