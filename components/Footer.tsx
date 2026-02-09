import React from 'react';
import { Github, Twitter, Mail, Info, Terminal, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-20 mt-20 pb-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto glass-dark rounded-[2.5rem] border border-white/10 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 p-10">
          
          {/* Patch Notes Section */}
          <div className="space-y-6 md:col-span-2">
            <h4 className="flex items-center gap-2 text-white font-black uppercase tracking-widest text-sm">
                <Terminal size={18} className="text-neu-accent" /> Patch Command Center
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 glass-light rounded-2xl border border-white/5 space-y-2">
                    <p className="text-[10px] font-black text-neu-accent uppercase tracking-widest">Latest Updates (V2.6)</p>
                    <ul className="text-xs text-white/60 space-y-1 list-disc pl-4">
                        <li>Native Spatial Agentic xScribe AI</li>
                        <li>Local Persistence (Watch Later & History)</li>
                        <li>Personal Viewing Analytics Dashboard</li>
                        <li>Mobile Layout Centering & Scaling Fixes</li>
                    </ul>
                </div>
                
                <div className="p-4 glass-light rounded-2xl border border-white/5 space-y-2">
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Upcoming Deployment</p>
                    <ul className="text-xs text-white/60 space-y-1 list-disc pl-4">
                        <li>Multi-Player Sync (Watch Party 2.0)</li>
                        <li>Advanced Scene Recommender Engine</li>
                        <li>Cross-Device Session Handoff</li>
                    </ul>
                </div>
            </div>
          </div>

          {/* Social & Info */}
          <div className="space-y-6">
            <h4 className="flex items-center gap-2 text-white font-black uppercase tracking-widest text-sm">
                <Info size={18} className="text-white/40" /> Archive Info
            </h4>
            <p className="text-xs text-white/40 leading-relaxed font-medium">
                WSP Stream is a specialized cinematic experience built for high-performance media discovery. All data is processed locally for maximum privacy.
            </p>
            <div className="flex items-center gap-4">
                <SocialLink icon={<Github size={20} />} href="#" />
                <SocialLink icon={<Twitter size={20} />} href="#" />
                <SocialLink icon={<Mail size={20} />} href="#" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="px-10 py-6 border-t border-white/5 bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                &copy; 2026 WSP STREAM CORE. ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center gap-4 text-[10px] font-black text-white/20 uppercase tracking-widest">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
                    <Sparkles size={10} /> Status: Online
                </a>
            </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink: React.FC<{ icon: React.ReactNode, href: string }> = ({ icon, href }) => (
    <a 
        href={href} 
        className="w-10 h-10 rounded-full glass-light flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5 shadow-lg"
    >
        {icon}
    </a>
);
