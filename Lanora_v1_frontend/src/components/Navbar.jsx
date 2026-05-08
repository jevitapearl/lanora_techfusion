import { useState } from "react"
import { Link } from "react-router-dom"
import { Terminal, Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleNavbar = () => setIsOpen(!isOpen)

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between mx-auto px-4">
        <Link 
          to="/" 
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-2 font-bold font-mono text-lg hover:opacity-80 transition-opacity"
        >
          <Terminal className="h-5 w-5 text-emerald-500" />
          <span>Lanora</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
            <Link 
              to="/register" 
              className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-md hover:bg-neutral-200 transition-colors"
            >
              Register
            </Link>
          </nav>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleNavbar} className="text-muted-foreground hover:text-foreground">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border/40 bg-background px-4 py-4 space-y-4 shadow-lg absolute w-full top-14 left-0">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/login" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-center border border-border/40 py-2 rounded-md"
              onClick={toggleNavbar}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="text-center text-sm font-medium bg-foreground text-background px-4 py-2 rounded-md hover:bg-neutral-200 transition-colors"
              onClick={toggleNavbar}
            >
              Register
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
