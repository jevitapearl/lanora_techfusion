import { NavLink } from "react-router-dom"
import { 
  Activity, 
  Box, 
  HardDrive,
  Key,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Terminal as TerminalIcon,
  HomeIcon,
  Clock,
} from "lucide-react"
import UserProfile from "./UserProfile"

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Sandboxes', href: '/dashboard/sandboxes', icon: Box },
  { name: 'Test History', href: '/dashboard/history', icon: Clock },
  { name: 'Resource Usage', href: '/dashboard/resources', icon: Activity },
]

export default function DashboardSidebar({ isOpen, closeSidebar, toggleSidebar }) {
  
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" 
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 transform transition-all duration-300 ease-in-out
        md:relative z-40 bg-[#0a0a0a] border-r border-white/5 flex flex-col shrink-0
        ${isOpen 
          ? "translate-x-0 w-60 p-4" 
          : "-translate-x-full md:translate-x-0 md:w-[72px] md:p-3 md:items-center"
        }
      `}>
         <div className={`flex items-center h-10 shrink-0 ${isOpen ? "justify-between px-1" : "justify-center"} mb-6 md:mb-8 mt-2`}>
           <NavLink to="/dashboard" className="flex items-center gap-2 text-emerald-500 font-bold tracking-tight text-xl hover:opacity-80 transition-opacity">
             <TerminalIcon className="w-6 h-6 shrink-0" />
             {isOpen && <span>Lanora</span>}
           </NavLink>
           {/* Mobile Close Button */}
           <button onClick={closeSidebar} className="md:hidden hover:text-white transition-colors text-neutral-400">
             <X className="w-5 h-5"/>
           </button>
         </div>

         <div className={`space-y-1 md:mt-4 font-medium text-neutral-400 max-h-[calc(100vh-100px)] overflow-y-auto w-full ${!isOpen ? "flex flex-col items-center" : ""}`}>
           {navigation.map((item) => (
             <NavLink
               key={item.name}
               to={item.href}
               end={item.href === '/dashboard'}
               onClick={() => {
                  if (window.innerWidth < 768) closeSidebar();
               }}
               className={({ isActive }) =>
                 `flex items-center rounded-lg cursor-pointer transition-colors ${
                   isOpen ? "gap-3 px-3 py-2.5 w-full" : "justify-center w-10 h-10 mb-1"
                 } ${
                   isActive ? 'bg-white/10 text-white' : 'hover:text-white hover:bg-white/5'
                 }`
               }
               title={!isOpen ? item.name : ""}
             >
               <item.icon className="h-4 w-4 shrink-0"/> 
               {isOpen && <span className="truncate">{item.name}</span>}
             </NavLink>
           ))}
         </div>
         <div className={`mt-auto space-y-1 mb-4 font-medium text-neutral-400 w-full ${!isOpen ? "flex flex-col items-center" : ""}`}>
           <div className={`mb-2 w-full ${isOpen ? "px-1" : "flex justify-center"}`}>
             <UserProfile isCollapsed={!isOpen} />
           </div>
           <NavLink
             to="/dashboard/settings"
             onClick={() => {
                if (window.innerWidth < 768) closeSidebar();
             }}
             className={({ isActive }) =>
               `flex items-center rounded-lg cursor-pointer transition-colors ${
                 isOpen ? "gap-3 px-3 py-2.5 w-full" : "justify-center w-10 h-10"
               } ${
                 isActive ? 'bg-white/10 text-white' : 'hover:text-white hover:bg-white/5'
               }`
             }
             title={!isOpen ? "Settings" : ""}
           >
             <Key className="h-4 w-4 shrink-0"/> 
             {isOpen && <span>Settings</span>}
           </NavLink>
           
           <button 
             onClick={toggleSidebar}
             className={`flex items-center rounded-lg cursor-pointer transition-colors ${
               isOpen ? "gap-3 px-3 py-2.5 w-full mt-2" : "justify-center w-10 h-10 mt-2"
             } text-neutral-400 hover:text-white hover:bg-white/5`}
             title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
           >
             {isOpen ? (
               <>
                 <PanelLeftClose className="h-4 w-4 shrink-0"/> 
                 <span>Collapse Sidebar</span>
               </>
             ) : (
               <PanelLeftOpen className="h-4 w-4 flex-shrink-0" />
             )}
           </button>
         </div>
      </div>
    </>
  )
}
