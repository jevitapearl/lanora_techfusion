import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CircleUser, X, Loader2 } from "lucide-react"

export default function Settings() {
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  
  // Modals state
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const [profileForm, setProfileForm] = useState({ username: "", email: "" })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" })
  const [joinDateStr, setJoinDateStr] = useState("April 2026");
  
  // Action status
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    // Load dynamic data on mount
    const savedUser = localStorage.getItem("username") || "Developer"
    const savedEmail = localStorage.getItem("email") || "developer@example.com"
    const storedJoinDate = localStorage.getItem("joinDate");
    
    setUsername(savedUser)
    setEmail(savedEmail)
    
    if (storedJoinDate) {
      const date = new Date(storedJoinDate);
      setJoinDateStr(`${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`);
    }
    
    // Sync forms
    setProfileForm({ username: savedUser, email: savedEmail })
  }, [])

  const handleLogout = () => {
    navigate("/")
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      })

      const data = await res.json()
      
      if (!res.ok) throw new Error(data.message || "Failed to update profile")

      // Success
      localStorage.setItem("username", profileForm.username)
      localStorage.setItem("email", profileForm.email)
      setUsername(profileForm.username)
      setEmail(profileForm.email)
      
      setSuccess("Profile updated successfully")
      setTimeout(() => {
        setShowProfileModal(false)
        setSuccess("")
      }, 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(passwordForm)
      })

      const data = await res.json()
      
      if (!res.ok) throw new Error(data.message || "Failed to update password")

      setSuccess("Password updated successfully")
      setPasswordForm({ currentPassword: "", newPassword: "" })
      
      setTimeout(() => {
        setShowPasswordModal(false)
        setSuccess("")
      }, 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="flex flex-col h-full animate-fade-in-up md:px-8 px-4 max-w-4xl mx-auto py-8 text-white w-full relative" style={{ animationDuration: '0.4s' }}>
      
      {/* Account Info Section */}
      <div className="bg-[#111111] border border-white/5 rounded-lg p-6 mb-8 shadow-sm">
        <h2 className="text-sm font-semibold text-neutral-300 mb-6">Account info</h2>
        
        <div className="flex items-center gap-8 pl-4">
          <div className="w-20 h-20 rounded-full bg-[#1a1a1a] border border-white/10 shrink-0 flex items-center justify-center">
            <CircleUser className="w-12 h-12 text-neutral-400" strokeWidth={1} />
          </div>
          <div className="flex flex-col space-y-3 text-sm text-neutral-200">
            <div className="font-medium text-white">{username}</div>
            <div className="text-neutral-400">{email}</div>
            <div className="text-neutral-500 text-xs">Joined {joinDateStr}</div>
          </div>
        </div>
      </div>

      {/* Manage your Account Section */}
      <div className="bg-[#111111] border border-white/5 rounded-lg p-6 mb-12 shadow-sm">
        <h2 className="text-sm font-semibold text-neutral-300 mb-8">Manage your Account</h2>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center sm:px-4">
          <button 
            onClick={() => {
              setShowProfileModal(true); 
              setError(""); 
              setSuccess("");
            }}
            className="flex-1 py-3 px-4 border border-white/20 rounded-md bg-[#161616] text-white text-xs font-bold tracking-widest hover:bg-white/5 hover:border-white/40 transition-colors uppercase"
          >
            UPDATE PROFILE
          </button>
          <button 
            onClick={() => {
              setShowPasswordModal(true); 
              setError(""); 
              setSuccess("");
            }}
            className="flex-1 py-3 px-4 border border-white/20 rounded-md bg-[#161616] text-white text-xs font-bold tracking-widest hover:bg-white/5 hover:border-white/40 transition-colors uppercase"
          >
            UPDATE PASSWORD
          </button>
        </div>
      </div>

      {/* Destructive Actions Section */}
      <div className="flex justify-center mt-auto sm:mt-0 pt-4">
        <button 
          onClick={handleLogout}
          className="w-full sm:w-64 py-3 px-4 bg-[#b31414] text-white text-sm font-bold rounded hover:bg-[#cf1818] transition-colors shadow-md uppercase tracking-wider"
        >
          Log Out
        </button>
      </div>

      {/* Update Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-6">Update Profile</h3>
            
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">Username</label>
                <input 
                  type="text" 
                  value={profileForm.username}
                  onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">Email</label>
                <input 
                  type="email" 
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
              
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              {success && <p className="text-emerald-400 text-sm mt-2">{success}</p>}
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-6 bg-white text-black font-bold py-2 rounded-md hover:bg-neutral-200 transition-colors flex items-center justify-center"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Update Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-6">Update Password</h3>
            
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">Current Password</label>
                <input 
                  type="password" 
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">New Password</label>
                <input 
                  type="password" 
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                  minLength={6}
                />
              </div>
              
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              {success && <p className="text-emerald-400 text-sm mt-2">{success}</p>}
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-6 bg-white text-black font-bold py-2 rounded-md hover:bg-neutral-200 transition-colors flex items-center justify-center"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
