import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CircleUser } from "lucide-react"

export default function UserProfile({ isCollapsed = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const popupRef = useRef(null)
  const navigate = useNavigate()

  const username = localStorage.getItem("username") || "Developer"
  const email = localStorage.getItem("email") || "developer@example.com"

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleManageAccount = () => {
    setIsOpen(false)
    navigate("/dashboard/settings")
  }

  const handleLogout = () => {
    setIsOpen(false)
    navigate("/")
  }

  return (
    <div className="relative font-sans w-full" ref={popupRef}>
      {isOpen && (
        <div className={`absolute bottom-[calc(100%+8px)] ${isCollapsed ? 'left-12' : 'left-0'} w-[200px] bg-[#1a1a1a] rounded-lg p-2 shadow-2xl border border-white/10 z-50`}>
          <div className="flex flex-col gap-2">
            <div className="border border-white/10 rounded-md p-3 bg-white/[0.02] flex flex-col gap-0.5 cursor-default">
              <div className="flex items-center gap-2 text-white">
                <CircleUser className="w-4 h-4 shrink-0" />
                <span className="font-semibold text-sm truncate">{username}</span>
              </div>
              <div className="text-xs text-neutral-400 ml-6 underline decoration-neutral-500 underline-offset-2 truncate">
                {email}
              </div>
            </div>
            
            <button 
              onClick={handleManageAccount}
              className="border border-white/10 rounded-md py-2 px-3 bg-white/[0.02] text-neutral-300 font-medium text-center hover:bg-white/5 hover:text-white transition-colors text-sm"
            >
              Manage Account
            </button>
            
            <button 
              onClick={handleLogout}
              className="rounded-md py-2 px-3 bg-red-600/90 text-white font-semibold text-center text-sm tracking-wide hover:bg-red-600 transition-colors shadow-sm"
            >
              Log Out
            </button>
          </div>
        </div>
      )}

      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center cursor-pointer rounded-lg transition-colors text-neutral-400 hover:text-white hover:bg-white/5 ${
          isCollapsed ? "justify-center w-10 h-10 w-full" : "px-3 py-2.5 w-full"
        }`}
        title={isCollapsed ? "User Profile" : ""}
      >
        <div className={`flex items-center ${isCollapsed ? "" : "gap-3"} min-w-0`}>
          <CircleUser className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium truncate">{username}</span>}
        </div>
      </div>
    </div>
  )
}
