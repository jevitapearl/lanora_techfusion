import { useState, useRef, useEffect } from "react"
import { Outlet } from "react-router-dom"
import { 
  Bell,
  Search,
  Megaphone,
  LifeBuoy
} from "lucide-react"

import DashboardSidebar from "../components/DashboardSidebar"

// Reusable Topbar Dropdown
function TopbarDropdown({ icon: Icon, title, children }) {
  const [isOpen, setIsOpen] = useState(false)
  const popupRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={popupRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-neutral-400 hover:text-white transition-colors relative flex items-center justify-center h-8 w-8 rounded hover:bg-white/5"
      >
        <Icon className="w-4 h-4 cursor-pointer" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl z-50 p-3 animate-in fade-in zoom-in-95 duration-200">
          <h4 className="text-sm font-bold text-white mb-3 px-1">{title}</h4>
          <div className="space-y-1">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}


export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white flex flex-col font-sans select-none">
      
      {/* Topbar */}
      <div className="h-14 bg-[#0a0a0a] border-b border-white/5 flex items-center px-4 md:px-6 justify-between z-20 shrink-0">
         <div className="flex items-center gap-4">
           {/* Removed cli connected status */}
           <div className="hidden sm:flex text-neutral-500 text-xs font-semibold tracking-wider">
             WORKSPACE
           </div>
         </div>
         
         <div className="flex items-center gap-2">
            
            <TopbarDropdown icon={Megaphone} title="Announcements">
               <div className="text-neutral-400 text-xs px-2 py-2 cursor-pointer hover:bg-white/5 hover:text-white rounded transition-colors">
                 No new announcements.
               </div>
            </TopbarDropdown>

            <TopbarDropdown icon={Bell} title="Notifications">
               <div className="text-neutral-400 text-xs px-2 py-2 cursor-pointer hover:bg-white/5 hover:text-white rounded transition-colors">
                 You have zero unseen events.
               </div>
            </TopbarDropdown>

            <TopbarDropdown icon={LifeBuoy} title="Support">
               <a href="#" className="block text-neutral-300 text-xs px-2 py-2 cursor-pointer hover:bg-white/5 hover:text-white rounded transition-colors">Documentation</a>
               <a href="#" className="block text-neutral-300 text-xs px-2 py-2 cursor-pointer hover:bg-white/5 hover:text-white rounded transition-colors">Contact</a>
               <a href="#" className="block text-neutral-300 text-xs px-2 py-2 cursor-pointer hover:bg-white/5 hover:text-white rounded transition-colors">About Us</a>
            </TopbarDropdown>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <DashboardSidebar 
          isOpen={isSidebarOpen} 
          closeSidebar={() => setIsSidebarOpen(false)}
          toggleSidebar={toggleSidebar}
        />

        {/* Main Content Component */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
