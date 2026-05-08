import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { useAppData } from "../hooks/useAppData"
import RunTable from "../components/RunTable"

export default function TestHistory() {
  const { data, loading } = useAppData();

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const allTests = data?.testHistory?.tests ?? [];
  // Filter logic
  const filteredTests = allTests.filter(test => {
    const matchesSearch = 
      (test.agent || test.sandbox || test.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
      String(test.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      ("run-" + String(test.id)).toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "All" || test.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col h-full animate-fade-in-up" style={{ animationDuration: '0.4s' }}>
      <div className="flex justify-between items-start mb-8 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Test History</h3>
          <p className="text-neutral-500 text-sm mt-1">Review logs and execution results from past runs.</p>
        </div>
      </div>
      
      <div className="flex gap-4 items-center mb-6 relative">
         <div className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-md text-sm text-white flex-1 focus-within:border-emerald-500/50 transition-colors">
           <Search className="w-4 h-4 text-neutral-400" /> 
           <input 
             type="text"
             placeholder="Search run ID or agent name..."
             className="bg-transparent outline-none w-full placeholder:text-neutral-500"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
         </div>
         
         <div className="relative">
           <button 
             onClick={() => setIsFilterOpen(!isFilterOpen)}
             className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-md text-sm text-white font-medium hover:bg-white/10 transition-colors"
           >
             <Filter className="w-4 h-4" /> 
             {statusFilter !== "All" ? `Filter: ${statusFilter}` : "Filter"}
           </button>
           
           {isFilterOpen && (
             <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-200">
               {["All", "Running", "Terminated", "Success", "Error"].map(status => (
                 <button
                   key={status}
                   onClick={() => { setStatusFilter(status); setIsFilterOpen(false); }}
                   className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${statusFilter === status ? "bg-emerald-500/10 text-emerald-500 font-bold" : "text-neutral-400 hover:bg-white/5 hover:text-white"}`}
                 >
                   {status}
                 </button>
               ))}
             </div>
           )}
         </div>
      </div>
      
      {loading ? (
        <div className="py-12 text-center border border-white/5 rounded-xl bg-white/[0.02]">
           <p className="text-neutral-500 text-sm">Loading history...</p>
        </div>
      ) : (
        <RunTable runs={filteredTests} />
      )}
    </div>
  )
}
