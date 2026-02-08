import React, { useState } from 'react';
import { NeuCard, NeuInput, NeuButton } from './NeumorphicUI';
import { Lock, Mail, User, Grid, KeyRound, QrCode, Loader2 } from 'lucide-react';
import { AuthMode } from '../types';

interface AuthGatewayProps {
  onLogin: () => void;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Real Simulation Logic
    setTimeout(() => {
      setLoading(false);
      if (email.includes('@') && password.length >= 6) {
        onLogin();
      } else {
        alert("Invalid email pattern or password too short (min 6 charts)");
      }
    }, 1200);
  };

  const handlePinSubmit = () => {
    if (pin.length === 5) {
      setLoading(true);
      // PIN 55555 is the guest/tester PIN
      setTimeout(() => {
        setLoading(false);
        if (pin === "55555") {
          onLogin();
        } else {
          alert("Invalid Access PIN. Access Denied.");
          setPin('');
        }
      }, 1000);
    } else {
      alert("PIN must be exactly 5 digits.");
    }
  };

  const handlePinInput = (num: number) => {
    if (pin.length < 5) setPin(prev => prev + num);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-neu-base">
      <NeuCard className="w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-8">
            <img src="/assets/logo-favi.png" alt="WSP Logo" className="w-24 h-24 mx-auto mb-4 drop-shadow-lg" />
            <h2 className="text-2xl font-bold text-neu-text tracking-wider">WAYANG SENI PUJANGGA</h2>
            <p className="text-sm text-gray-500 mt-2">Authentic Streaming Experience</p>
        </div>

        {/* Mode Switcher */}
        <div className="flex justify-center space-x-4 mb-8">
          <button 
            title="Email Login"
            onClick={() => setMode('LOGIN')}
            className={`p-2 rounded-lg transition-all ${mode === 'LOGIN' ? 'text-neu-accent shadow-neu-in' : 'text-gray-400 hover:text-neu-text'}`}
          >
            <User size={24} />
          </button>
          <button 
            title="PIN Pad Access"
            onClick={() => setMode('GUEST_PIN')}
            className={`p-2 rounded-lg transition-all ${mode === 'GUEST_PIN' ? 'text-neu-accent shadow-neu-in' : 'text-gray-400 hover:text-neu-text'}`}
          >
            <Grid size={24} />
          </button>
          <button 
             title="QR GGIF Visual Auth"
             onClick={() => setMode('QRGGIF')}
             className={`p-2 rounded-lg transition-all ${mode === 'QRGGIF' ? 'text-neu-accent shadow-neu-in' : 'text-gray-400 hover:text-neu-text'}`}
          >
            <QrCode size={24} />
          </button>
        </div>

        {/* Login Form */}
        {mode === 'LOGIN' && (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <NeuInput 
                type="email" 
                placeholder="Email Address" 
                className="pl-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <NeuInput 
                type="password" 
                placeholder="Password" 
                className="pl-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <NeuButton type="submit" className="w-full" variant="primary" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </NeuButton>
          </form>
        )}

        {/* PIN Pad */}
        {mode === 'GUEST_PIN' && (
          <div className="space-y-6">
            <div className="flex justify-center mb-4">
              <div className="flex space-x-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-4 h-4 rounded-full border-2 border-neu-accent ${i < pin.length ? 'bg-neu-accent' : 'bg-transparent'}`} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  title={`Enter ${num}`}
                  type="button"
                  onClick={() => handlePinInput(num)}
                  className="h-14 rounded-xl text-xl font-bold text-neu-text shadow-neu-btn active:shadow-neu-btn-active hover:text-neu-accent transition-all"
                >
                  {num}
                </button>
              ))}
              <button 
                title="Clear PIN"
                onClick={() => setPin('')}
                className="h-14 rounded-xl text-sm font-bold text-red-400 shadow-neu-btn active:shadow-neu-btn-active"
              >
                CLR
              </button>
              <button onClick={() => handlePinInput(0)} title="Zero" className="h-14 rounded-xl text-xl font-bold text-neu-text shadow-neu-btn active:shadow-neu-btn-active hover:text-neu-accent">0</button>
              <button 
                title="Submit PIN"
                onClick={handlePinSubmit}
                className="h-14 rounded-xl text-neu-accent shadow-neu-btn active:shadow-neu-btn-active flex items-center justify-center"
              >
                <KeyRound size={20} />
              </button>
            </div>
          </div>
        )}

        {/* QRGGIF Mock */}
        {mode === 'QRGGIF' && (
            <div className="text-center py-8 space-y-4 animate-fade-in">
                <div className="w-48 h-48 mx-auto bg-neu-base shadow-neu-in rounded-3xl flex items-center justify-center border-4 border-dashed border-neu-accent/30 hover:border-neu-accent transition-all cursor-pointer group">
                     {loading ? (
                         <div className="flex flex-col items-center">
                            <Loader2 className="animate-spin text-neu-accent mb-2" size={32} />
                            <p className="text-[10px] font-black uppercase text-gray-400">Decrypting QR GIF...</p>
                         </div>
                     ) : (
                         <div className="flex flex-col items-center group-hover:scale-110 transition-transform">
                            <QrCode size={48} className="text-neu-accent mb-2 opacity-40" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Upload QR GGIF File</p>
                         </div>
                     )}
                </div>
                <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">WSP Visual Auth</p>
                    <p className="text-[10px] text-gray-400">Scan or Upload your dynamic session GIF to unlock the stream.</p>
                </div>
                <NeuButton 
                    onClick={() => {
                        setLoading(true);
                        setTimeout(() => {
                            setLoading(false);
                            onLogin();
                        }, 2000);
                    }} 
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? 'Processing Visuals...' : 'Simulate QR Validation'}
                </NeuButton>
            </div>
        )}
      </NeuCard>
    </div>
  );
};