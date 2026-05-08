import { ArrowRight, Terminal as TerminalIcon, Activity, HardDrive, Box, Sparkles, ChevronRight, Rocket, Zap, Radio, Shield, BarChart3, Copy, Code2, FileWarning, Key, CheckCircle2, XCircle, Check, Play, Workflow, Search, Bell, Filter } from "lucide-react"
import { Link } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { useScrollReveal } from "../hooks/useScrollReveal"

// -- Reusable Components -- //

const Reveal = ({ children, delay = 0, className = "" }) => {
  const { ref, isVisible } = useScrollReveal()
  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

const SpotlightCard = ({ children, className = "" }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-8 transition-all hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/20 group ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(16,185,129,0.15), transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// -- Main Landing Page -- //

export default function Landing() {
  const [mounted, setMounted] = useState(false)
  const [copiedText, setCopiedText] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const copyCommand = () => {
    setCopiedText(true)
    setTimeout(() => setCopiedText(false), 2000)
  }

  return (
    <div className="flex-1 flex flex-col relative bg-[#030712] overflow-hidden min-h-screen text-white">
      
      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]"></div>
        <div className="absolute inset-0 bg-black/60 bg-[radial-gradient(ellipse_at_center,transparent,black_80%)]"></div>
      </div>

      {/* Hero Animated Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-600/30 blur-[150px] rounded-full pointer-events-none animate-blob mix-blend-screen opacity-50"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-violet-600/30 blur-[150px] rounded-full pointer-events-none animate-blob animation-delay-2000 mix-blend-screen opacity-40"></div>

      {/* ------------------------------------- */}
      {/* 1. Hero Section */}
      {/* ------------------------------------- */}
      <section className="relative pt-32 pb-40 px-4 text-center flex flex-col items-center justify-center max-w-5xl mx-auto space-y-10 z-10 min-h-[90vh]">
        <div className={`transition-all duration-1000 transform ease-in-out ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}>
          <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md px-4 py-1.5 text-sm font-medium text-emerald-400 cursor-default shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Sparkles className="h-4 w-4 mr-2 animate-pulse text-emerald-300" />
            Lanora Engine v1.0 Released
          </div>
        </div>
        
        <h1 className={`text-6xl md:text-8xl font-extrabold tracking-tight transition-all duration-1000 delay-150 transform ${mounted ? 'opacity-100 translate-y-0 text-glow' : 'opacity-0 translate-y-12'}`}>
          <span className="text-white">Run AI agents with </span>
          <br className="hidden md:block"/>
          <span className="animate-gradient-x bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto]">
            absolute control.
          </span>
        </h1>
        
        <p className={`text-xl md:text-2xl text-neutral-400 max-w-3xl transition-all duration-1000 delay-300 transform font-light ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          Execute sandboxed runtimes directly from your CLI. Monitor everything through a mesmerizing real-time orchestration dashboard.
        </p>

        {/* CTA Group */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 transition-all duration-1000 delay-500 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <Link 
            to="/register" 
            className="group relative flex items-center justify-center gap-3 bg-white text-black px-10 h-14 rounded-xl font-bold text-lg hover:bg-neutral-200 transition-all active:scale-95 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]"
          >
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            Start Sandboxing <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>



      {/* ------------------------------------- */}
      {/* 3. How It Works */}
      {/* ------------------------------------- */}
      <section className="relative py-24 border-t border-white/5 bg-black/50 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">How It Works</h2>
              <p className="text-neutral-400">A developer-first setup taking less than 60 seconds.</p>
            </div>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Install CLI", icon: TerminalIcon },
              { step: "02", title: "Register", icon: Key },
              { step: "03", title: "Run Commands", icon: Play },
              { step: "04", title: "View Logs", icon: Activity },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 200}>
                <div className="relative group text-center">
                  {i !== 3 && <div className="hidden md:block absolute top-[28px] left-[60%] w-full h-[2px] bg-gradient-to-r from-emerald-500/50 to-transparent"></div>}
                  <div className="mx-auto w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/50 group-hover:scale-110 transition-all duration-300 relative z-10 shadow-xl bg-[#030712]">
                    <item.icon className="h-6 w-6 text-emerald-400 group-hover:text-emerald-300" />
                  </div>
                  <div className="text-emerald-500 font-mono text-sm mb-2">{item.step}</div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------- */}
      {/* 4. Why Lanora */}
      {/* ------------------------------------- */}
      <section className="relative py-32 bg-black border-t border-white/10 z-10">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]"></div>
        <div className="max-w-5xl mx-auto px-4 relative">
          <Reveal>
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl md:text-6xl font-black text-white">
                Why <span className="text-emerald-400">Lanora?</span>
              </h2>
              <p className="text-neutral-400 text-xl font-light">The complete operating system for agentic workflows.</p>
            </div>
          </Reveal>

          <div className="space-y-6">
            {[
              { icon: Rocket, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", title: "Eliminates complex setup", desc: "Run AI agents locally and in the cloud without tedious manual configuration. It just works." },
              { icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", title: "Speeds up development", desc: "Instantly test and debug your agents in seconds. Fast iteration cycles built for modern AI engineers." },
              { icon: Radio, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", title: "Real-time visibility", desc: "Watch execution flow live. Instantly see streaming logs and deeply understand agent behavior." },
              { icon: Shield, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", title: "Safe sandbox execution", desc: "Total peace of mind. Run arbitrary agents in completely isolated environments." },
              { icon: BarChart3, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", title: "Centralized tracking", desc: "All your historical runs, resource costs, and outputs securely stored in one place." },
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="group relative flex flex-col md:flex-row items-start md:items-center gap-6 p-6 md:p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 hover:scale-[1.01] overflow-hidden">
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000"></div>
                  <div className={`h-16 w-16 shrink-0 rounded-2xl flex items-center justify-center border ${feature.bg} ${feature.border} ${feature.color} group-hover:scale-110 transition-transform duration-500`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-neutral-400 transition-all">{feature.title}</h3>
                    <p className="text-neutral-400 text-lg leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------- */}
      {/* 5. CLI Section */}
      {/* ------------------------------------- */}
      <section className="relative py-32 border-t border-white/5 bg-[#030712] z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-black text-white">Feel the power of the <span className="text-cyan-400">CLI</span></h2>
              <p className="text-neutral-400 text-lg">We didn't just build a dashboard. We built a robust command-line interface that integrates exactly where you already work.</p>
              <div className="pt-4 flex gap-4">
                <Link to="/docs" className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-2">
                  Read CLI Documentation <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="rounded-2xl border border-white/10 bg-black p-6 shadow-2xl relative group">
               {/* command run demo pic */}
               <div className="space-y-6 font-mono text-[15px]">
                  <div>
                    <div className="text-neutral-500 text-sm mb-2">// 1. Install the package globally</div>
                    <div className="flex items-center gap-3">
                      <span className="text-cyan-500">❯</span> 
                      <span className="text-white">pip install lanora</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-500 text-sm mb-2">// 2. Link to your cloud dashboard</div>
                    <div className="flex items-center gap-3">
                      <span className="text-cyan-500">❯</span> 
                      <span className="text-white">lanora register</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-500 text-sm mb-2">// 3. Deploy sandbox from local folder</div>
                    <div className="flex items-center gap-3">
                      <span className="text-cyan-500">❯</span> 
                      <span className="text-white">lanora run agent ./src</span>
                    </div>
                  </div>
               </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------- */}
      {/* 6. Features Section */}
      {/* ------------------------------------- */}
      <section className="relative py-32 bg-black border-t border-white/10 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-24 space-y-4">
              <h2 className="text-4xl md:text-6xl font-black text-white">Unprecedented <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Visibility.</span></h2>
              <p className="text-neutral-400 text-xl font-light">Core features missing from your current AI development stack.</p>
            </div>
          </Reveal>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Reveal delay={100}>
              <SpotlightCard className="h-full">
                <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-8 border border-cyan-500/20 text-cyan-400">
                  <TerminalIcon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">CLI-First Workflow</h3>
                <p className="text-neutral-400 text-lg leading-relaxed">Bridge your local terminal environment to cloud orchestration instantly.</p>
              </SpotlightCard>
            </Reveal>

            <Reveal delay={300}>
              <SpotlightCard className="h-full">
                <div className="h-16 w-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-8 border border-violet-500/20 text-violet-400">
                  <Box className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Hyper Sandboxing</h3>
                <p className="text-neutral-400 text-lg leading-relaxed">Secure, instant-on containers for every agent sequence. Complete file isolation.</p>
              </SpotlightCard>
            </Reveal>
            
            <Reveal delay={500}>
              <SpotlightCard className="h-full">
                <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 border border-emerald-500/20 text-emerald-400">
                  <Activity className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Real-Time Logs</h3>
                <p className="text-neutral-400 text-lg leading-relaxed">Watch every CPU cycle and GPU spike. Log streams sync directly to your dashboard.</p>
              </SpotlightCard>
            </Reveal>

            <Reveal delay={700}>
              <SpotlightCard className="h-full">
                <div className="h-16 w-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-8 border border-amber-500/20 text-amber-400">
                  <HardDrive className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Run History</h3>
                <p className="text-neutral-400 text-lg leading-relaxed">Never lose an output again. Unlimited persistent historical tracking.</p>
              </SpotlightCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------- */}
      {/* 7. Use Cases */}
      {/* ------------------------------------- */}
      <section className="relative py-32 border-t border-white/5 bg-[#030712] z-10">
        <div className="max-w-6xl mx-auto px-4">
           <Reveal>
              <div className="mb-16">
                <h2 className="text-4xl font-black text-white mb-6">Designed for real use cases</h2>
                <p className="text-neutral-400 text-xl">Stop scaffolding infrastructure. Start solving problems.</p>
              </div>
           </Reveal>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { title: "Testing AI Agents", desc: "Validate complex multi-step reasoning outputs.", icon: Workflow },
               { title: "Debugging Workflows", desc: "Trace logic branches securely with console outputs.", icon: FileWarning },
               { title: "Prompt Experiments", desc: "A/B test system prompts with instant sandbox feedback.", icon: Sparkles },
               { title: "Learning AI Dev", desc: "A flawless sandbox to learn LLM integrations safely.", icon: Code2 },
             ].map((uc, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div className="h-full bg-white/[0.02] border border-white/5 p-8 rounded-2xl hover:bg-white/[0.04] transition-colors border-l-4 border-l-emerald-500 hover:-translate-y-1">
                    <uc.icon className="h-6 w-6 text-emerald-400 mb-6" />
                    <h3 className="font-bold text-xl text-white mb-3">{uc.title}</h3>
                    <p className="text-neutral-400 leading-relaxed">{uc.desc}</p>
                  </div>
                </Reveal>
             ))}
           </div>
        </div>
      </section>

      {/* ------------------------------------- */}
      {/* 8. Who Is It For */}
      {/* ------------------------------------- */}
      <section className="relative py-24 bg-black border-t border-white/10 z-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Reveal>
             <h2 className="text-3xl font-black text-neutral-500 mb-12">BUILT SPECIFICALLY FOR</h2>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-12 lg:gap-24">
             <Reveal delay={100}><div className="text-2xl md:text-4xl font-black text-white hover:text-emerald-400 transition-colors cursor-default">Developers</div></Reveal>
             <Reveal delay={300}><div className="text-2xl md:text-4xl font-black text-white hover:text-cyan-400 transition-colors cursor-default">AI Engineers</div></Reveal>
             <Reveal delay={500}><div className="text-2xl md:text-4xl font-black text-white hover:text-violet-400 transition-colors cursor-default">Vibe Coders</div></Reveal>
          </div>
        </div>
      </section>



      {/* ------------------------------------- */}
      {/* 11. Security / Sandbox Section */}
      {/* ------------------------------------- */}
      <section className="relative py-24 bg-gradient-to-r from-emerald-950/40 via-cyan-950/40 to-violet-950/40 border-t border-white/10 z-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Reveal>
             <Shield className="h-16 w-16 text-emerald-400 mx-auto mb-6" />
             <h2 className="text-3xl font-bold text-white mb-4">Enterprise-grade isolated execution</h2>
             <p className="text-emerald-100/70 text-lg">Every `lanora run` spins up a totally isolated, short-lived sandbox environment. Safe from dependency conflicts, network bleeding, and file-system corruption.</p>
          </Reveal>
        </div>
      </section>


    </div>
  )
}
