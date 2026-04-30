import React, { useState, useEffect } from 'react';
import { Plus, User, Trash2, Pencil, RefreshCw } from 'lucide-react';
import { UserProfile } from '../types';
import { getProfiles, createProfile, deleteProfile, updateProfile, generateAvatar } from '../services/profileService';

interface ProfileSelectorProps {
  onSelectProfile: (profile: UserProfile) => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({ onSelectProfile }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  
  // Create State
  const [isCreating, setIsCreating] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  // Edit State
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    setProfiles(getProfiles());
  }, []);

  // Create Handlers
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProfileName.trim()) {
      createProfile(newProfileName.trim());
      setProfiles(getProfiles());
      setNewProfileName('');
      setIsCreating(false);
    }
  };

  // Edit Handlers
  const startEditing = (e: React.MouseEvent, profile: UserProfile) => {
    e.stopPropagation();
    setEditingProfile(profile);
    setEditName(profile.name);
    setEditAvatar(profile.avatar);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProfile && editName.trim()) {
      const updated = updateProfile(editingProfile.id, {
        name: editName.trim(),
        avatar: editAvatar
      });
      setProfiles(updated);
      setEditingProfile(null);
    }
  };

  const randomizeEditAvatar = () => {
    setIsSpinning(true);
    const randomSeed = Math.random().toString(36).substring(7);
    setEditAvatar(generateAvatar(randomSeed));
    setTimeout(() => setIsSpinning(false), 500);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this profile?")) {
      const updated = deleteProfile(id);
      setProfiles(updated);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 animate-fade-in bg-black">
      {/* Background Effect */}
      <div className="stars opacity-50"></div>
      
      <div className="w-full max-w-4xl text-center z-10">
        <h1 className="text-3xl md:text-5xl font-light text-white/90 mb-12 md:mb-16 tracking-[0.2em] font-cinematic">
            {profiles.length === 0 ? "WELCOME" : "WHO IS WATCHING?"}
        </h1>
        
        {profiles.length === 0 ? (
            <div className="flex justify-center animate-fade-in-up">
                <div className="w-full max-w-md">
                    <div className="white-glass flex flex-col items-center text-center p-10 border-white/20">
                        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 mb-6 flex items-center justify-center text-white/80">
                            <User size={40} />
                        </div>
                        <h2 className="text-2xl font-light text-white mb-2">Create Your Profile</h2>
                        <p className="text-white/40 mb-8 text-sm font-light">
                            Set up your profile to customize your experience and start streaming.
                        </p>
                        <button 
                            onClick={() => setIsCreating(true)}
                            className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 tracking-widest uppercase text-sm"
                        >
                            <Plus size={20} /> Get Started
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {profiles.map((profile) => (
                <div key={profile.id} className="group relative flex flex-col items-center">
                    <button
                        onClick={() => onSelectProfile(profile)}
                        className="w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 rounded-2xl md:rounded-3xl white-glass overflow-hidden mb-4 transition-all transform hover:scale-105 active:scale-95 border-2 border-white/10 hover:border-white/40 shadow-xl"
                    >
                        <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" />
                    </button>
                    <h3 className="text-base sm:text-xl font-light text-white/70 group-hover:text-white transition-colors tracking-wide">{profile.name}</h3>
                    
                    <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={(e) => startEditing(e, profile)}
                            className="p-2 bg-black/40 backdrop-blur-md rounded-lg text-white/60 hover:text-white border border-white/10"
                            title="Edit Profile"
                        >
                            <Pencil size={14} />
                        </button>
                        <button 
                            onClick={(e) => handleDelete(e, profile.id)}
                            className="p-2 bg-black/40 backdrop-blur-md rounded-lg text-white/60 hover:text-red-400 border border-white/10"
                            title="Delete Profile"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            ))}

            <div className="flex flex-col items-center">
                <button
                    title="Add Profile"
                    onClick={() => setIsCreating(true)}
                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 rounded-2xl md:rounded-3xl white-glass flex items-center justify-center text-white/30 hover:text-white hover:border-white/40 transition-all active:scale-95"
                >
                    <Plus size={32} className="md:w-16 md:h-16 font-light" />
                </button>
                <h3 className="text-base sm:text-xl font-light text-white/30 mt-4 tracking-wide">Add Profile</h3>
            </div>
            </div>
        )}

        {/* Modal Overlays */}
        {(isCreating || editingProfile) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-4 animate-fade-in">
            <div className="white-glass w-full max-w-md p-8 md:p-10 border-white/20">
              <h2 className="text-2xl font-light text-white mb-8 tracking-widest uppercase">
                  {isCreating ? "New Profile" : "Edit Profile"}
              </h2>
              
              <form onSubmit={isCreating ? handleCreate : handleUpdate} className="space-y-8">
                {editingProfile && (
                    <div className="flex flex-col items-center">
                        <div className="relative w-28 h-28 mb-4">
                            <img src={editAvatar} alt="Preview" className="w-full h-full rounded-2xl white-glass object-cover border border-white/20" />
                            <button 
                                type="button"
                                onClick={randomizeEditAvatar}
                                className="absolute -bottom-2 -right-2 p-3 bg-white text-black rounded-xl shadow-2xl hover:bg-white/90 transition-all"
                                title="Randomize Avatar"
                            >
                                <RefreshCw size={18} className={isSpinning ? 'animate-spin' : ''} />
                            </button>
                        </div>
                    </div>
                )}

                <div className="relative group">
                    <input 
                        autoFocus
                        type="text"
                        placeholder="Name" 
                        value={isCreating ? newProfileName : editName}
                        onChange={(e) => isCreating ? setNewProfileName(e.target.value) : setEditName(e.target.value)}
                        className="w-full bg-white/5 border-b-2 border-white/10 focus:border-white/40 outline-none py-3 px-2 text-white transition-all font-light tracking-widest"
                    />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => { setIsCreating(false); setEditingProfile(null); }} 
                    className="flex-1 py-4 text-white/50 hover:text-white transition-colors uppercase text-xs tracking-widest"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isCreating ? !newProfileName.trim() : !editName.trim()}
                    className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase text-xs tracking-widest font-bold"
                  >
                    {isCreating ? "Create" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};