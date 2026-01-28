import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Image as ImageIcon, Mic, Search, Bot, Loader2, Sparkles, Layers } from 'lucide-react';
import { NeuCard, NeuInput, NeuIconButton, NeuButton } from './NeumorphicUI';
import { generateChatResponse, generateImage, generateSearchResponse, transcribeAudio, generateSpatialDiscovery } from '../services/geminiService';
import { AspectRatio, ChatMessage } from '../types';

export const AINativeSpatialAgentic: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'chat' | 'image' | 'voice'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: 'Spatial Agentic active. I can discover media via text, voice, or image context. How can I assist your discovery?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Image Configs
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  
  // Search Config
  const [useSearch, setUseSearch] = useState(false);
  const [useFast, setUseFast] = useState(false);
  const [spatialMode, setSpatialMode] = useState(false);

  // Audio State
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() && mode !== 'voice') return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: inputText };
    setMessages((prev: ChatMessage[]) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      if (mode === 'image' && !spatialMode) {
        const base64Image = await generateImage(userMsg.text, aspectRatio);
        setMessages((prev: ChatMessage[]) => [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: 'model', 
          text: `Generated image for: "${userMsg.text}" (${aspectRatio})`,
          image: base64Image
        }]);
      } else if (spatialMode) {
        // AI Native Spatial Discovery
        const text = await generateSpatialDiscovery(userMsg.text);
        setMessages((prev: ChatMessage[]) => [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: 'model', 
          text: text 
        }]);
      } else {
        // Normal Chat/Search
        if (useSearch) {
          const result = await generateSearchResponse(userMsg.text);
          setMessages((prev: ChatMessage[]) => [...prev, { 
            id: (Date.now() + 1).toString(), 
            role: 'model', 
            text: result.text,
            sources: result.sources
          }]);
        } else {
          const history = messages.map(m => ({ 
            role: m.role, 
            parts: [{ text: m.text }] 
          }));
          const text = await generateChatResponse(userMsg.text, history, useFast);
          setMessages((prev: ChatMessage[]) => [...prev, { 
            id: (Date.now() + 1).toString(), 
            role: 'model', 
            text: text 
          }]);
        }
      }
    } catch (error) {
      setMessages((prev: ChatMessage[]) => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: "Sorry, something went wrong. Please try again.",
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsLoading(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' }); // Defaulting wav/webm
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
            const base64Audio = (reader.result as string).split(',')[1];
            try {
                const transcription = await transcribeAudio(base64Audio, 'audio/wav');
                // Auto-send transcribed text to chat
                setInputText(transcription);
                // Switch to chat to show the result in input
                setMode('chat');
            } catch (err) {
                console.error(err);
                setMessages((prev: ChatMessage[]) => [...prev, { id: Date.now().toString(), role: 'model', text: "Failed to transcribe audio.", isError: true }]);
            } finally {
                setIsLoading(false);
            }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error:", err);
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        title="Open Spatial Agentic"
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-neu-base shadow-neu-out flex items-center justify-center text-neu-accent hover:text-purple-600 transition-transform hover:scale-105 active:scale-95"
      >
        <Sparkles size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[450px] h-[600px] flex flex-col">
      <NeuCard className="flex-1 flex flex-col h-full overflow-hidden p-0">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-200/20 bg-neu-base z-10">
          <div className="flex items-center space-x-2">
            <Bot className="text-neu-accent" />
            <h3 className="font-bold text-lg text-neu-text tracking-tighter">SPATIAL AGENTIC</h3>
          </div>
          <button title="Close" onClick={() => setIsOpen(false)} className="text-neu-text hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-around p-2 bg-neu-base shadow-neu-in mx-4 mt-2 rounded-xl">
            <button title="Chat Mode" onClick={() => setMode('chat')} className={`p-2 rounded-lg transition-all ${mode === 'chat' ? 'text-neu-accent font-bold bg-gray-200/50' : 'text-gray-400'}`}><MessageCircle size={20}/></button>
            <button title="Image Mode" onClick={() => setMode('image')} className={`p-2 rounded-lg transition-all ${mode === 'image' ? 'text-neu-accent font-bold bg-gray-200/50' : 'text-gray-400'}`}><ImageIcon size={20}/></button>
            <button title="Voice Mode" onClick={() => setMode('voice')} className={`p-2 rounded-lg transition-all ${mode === 'voice' ? 'text-neu-accent font-bold bg-gray-200/50' : 'text-gray-400'}`}><Mic size={20}/></button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-neu-accent text-white shadow-neu-btn' 
                  : 'bg-neu-base text-neu-text shadow-neu-out'
              }`}>
                {msg.image && (
                    <img src={msg.image} alt="Generated" className="w-full rounded-lg mb-2 shadow-sm" />
                )}
                <p className="whitespace-pre-wrap">{msg.text}</p>
                {msg.sources && (
                    <div className="mt-2 pt-2 border-t border-gray-300 text-xs">
                        <p className="font-semibold mb-1">Sources:</p>
                        <ul className="list-disc pl-4 space-y-1">
                            {msg.sources.map((s: {uri: string, title?: string}, idx: number) => (
                                <li key={idx}>
                                    <a href={s.uri} target="_blank" rel="noreferrer" className="text-blue-500 underline truncate block hover:text-blue-700">
                                        {s.title || s.uri}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-neu-base p-4 rounded-2xl shadow-neu-out flex items-center space-x-2">
                 <Loader2 className="animate-spin text-neu-accent" size={16} />
                 <span className="text-xs text-gray-500">Thinking...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Controls based on Mode */}
        <div className="p-4 bg-neu-base border-t border-gray-200/20">
            {mode === 'image' && (
                 <div className="flex space-x-2 mb-3 overflow-x-auto no-scrollbar pb-2">
                    {(["1:1", "3:4", "4:3", "9:16", "16:9"] as AspectRatio[]).map((r: AspectRatio) => (
                        <button 
                            key={r}
                            title={`Aspect Ratio ${r}`}
                            onClick={() => setAspectRatio(r)}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors whitespace-nowrap ${aspectRatio === r ? 'bg-neu-accent text-white border-transparent' : 'border-gray-300 text-gray-500'}`}
                        >
                            {r}
                        </button>
                    ))}
                 </div>
            )}
            
            {mode === 'chat' && (
                 <div className="flex space-x-2 mb-3">
                     <button 
                        title="Toggle Grounding"
                        onClick={() => setUseSearch(!useSearch)}
                        className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-full border transition-colors ${useSearch ? 'bg-blue-500 text-white border-transparent' : 'border-gray-300 text-gray-500'}`}
                     >
                        <Search size={12} /> <span>Grounding</span>
                     </button>
                     <button 
                        title="Toggle Fast Mode"
                        onClick={() => setUseFast(!useFast)}
                        className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-full border transition-colors ${useFast ? 'bg-yellow-500 text-white border-transparent' : 'border-gray-300 text-gray-500'}`}
                     >
                        <Sparkles size={12} /> <span>Fast</span>
                     </button>
                     <button 
                        title="Toggle Spatial Context"
                        onClick={() => setSpatialMode(!spatialMode)}
                        className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-full border transition-colors ${spatialMode ? 'bg-purple-600 text-white border-transparent shadow-lg' : 'border-gray-300 text-gray-500'}`}
                     >
                        <Layers size={12} /> <span>Spatial Context</span>
                     </button>
                 </div>
            )}

            {mode === 'voice' ? (
                 <div className="flex justify-center items-center h-16">
                     <NeuIconButton 
                        title={isRecording ? "Stop Recording" : "Start Recording"}
                        onClick={isRecording ? stopRecording : startRecording}
                        active={isRecording}
                        className={`w-16 h-16 !rounded-full flex items-center justify-center ${isRecording ? 'animate-pulse text-red-500' : ''}`}
                     >
                        {isRecording ? <div className="w-6 h-6 bg-red-500 rounded-sm" /> : <Mic size={24} />}
                     </NeuIconButton>
                 </div>
            ) : (
                <div className="flex space-x-2">
                    <NeuInput 
                        value={inputText}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
                        placeholder={mode === 'image' ? "Describe image to generate..." : "Ask anything..."}
                        onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSend()}
                        className="flex-1"
                    />
                    <NeuIconButton title="Send Message" onClick={handleSend} disabled={isLoading}>
                        <Send size={20} />
                    </NeuIconButton>
                </div>
            )}
        </div>
      </NeuCard>
    </div>
  );
};