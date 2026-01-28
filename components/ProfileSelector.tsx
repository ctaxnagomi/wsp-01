import React, { useState, useEffect } from 'react';
import { Plus, User, Trash2, Pencil, RefreshCw } from 'lucide-react';
import { NeuCard, NeuInput, NeuButton } from './NeumorphicUI';
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
    <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-neu-text mb-12 tracking-wider">
            {profiles.length === 0 ? "Welcome to WSP Stream" : "Who is watching?"}
        </h1>
        
        {profiles.length === 0 ? (
             /* Placeholder UI for Empty State */
            <div className="flex justify-center animate-fade-in-up">
                <div className="w-full max-w-md">
                    <NeuCard className="flex flex-col items-center text-center p-10">
                        <div className="w-24 h-24 rounded-full bg-neu-base shadow-neu-out mb-6 flex items-center justify-center text-neu-accent">
                            <User size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-neu-text mb-2">Create Your Profile</h2>
                        <p className="text-gray-500 mb-8 text-sm">
                            It looks like you're new here. Set up your profile to customize your experience and start streaming.
                        </p>
                        <NeuButton 
                            variant="primary" 
                            onClick={() => setIsCreating(true)}
                            className="w-full flex items-center justify-center gap-2"
                        >
                            <Plus size={20} /> Get Started
                        </NeuButton>
                    </NeuCard>
                </div>
            </div>
        ) : (
            /* Existing Profile Grid */
            <div className="flex flex-wrap justify-center gap-8">
            {profiles.map((profile) => (
                <div key={profile.id} className="group relative">
                <button
                    title={`Select Profile: ${profile.name}`}
                    onClick={() => onSelectProfile(profile)}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-neu-base shadow-neu-out flex items-center justify-center overflow-hidden mb-4 transition-transform transform group-hover:scale-105 active:scale-95 border-4 border-transparent group-hover:border-neu-accent/20"
                >
                    <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                </button>
                <h3 className="text-xl font-semibold text-neu-text group-hover:text-neu-accent transition-colors">{profile.name}</h3>
                
                <div className="absolute -top-1 -right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                    onClick={(e) => startEditing(e, profile)}
                    className="p-2 bg-neu-base rounded-full text-blue-400 shadow-neu-btn hover:text-blue-600"
                    title="Edit Profile"
                    >
                    <Pencil size={16} />
                    </button>
                    <button 
                    onClick={(e) => handleDelete(e, profile.id)}
                    className="p-2 bg-neu-base rounded-full text-red-400 shadow-neu-btn hover:text-red-600"
                    title="Delete Profile"
                    >
                    <Trash2 size={16} />
                    </button>
                </div>
                </div>
            ))}

            {/* Add Profile Button */}
            <div className="flex flex-col items-center">
                <button
                title="Add New Profile"
                onClick={() => setIsCreating(true)}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-neu-base shadow-neu-out flex items-center justify-center text-neu-text/50 hover:text-neu-accent transition-all active:shadow-neu-in mb-4"
                >
                <Plus size={48} />
                </button>
                <h3 className="text-xl font-semibold text-neu-text/50">Add Profile</h3>
            </div>
            </div>
        )}

        {/* Create Profile Modal */}
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-neu-base/80 backdrop-blur-sm p-4 animate-fade-in">
            <NeuCard className="w-full max-w-md">
              <h2 className="text-2xl font-bold text-neu-text mb-6">Create Profile</h2>
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="relative">
                   <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                   <NeuInput 
                     autoFocus
                     placeholder="Name" 
                     value={newProfileName}
                     onChange={(e) => setNewProfileName(e.target.value)}
                     className="pl-12"
                   />
                </div>
                <div className="flex space-x-4">
                  <NeuButton type="button" onClick={() => setIsCreating(false)} className="flex-1">
                    Cancel
                  </NeuButton>
                  <NeuButton type="submit" variant="primary" className="flex-1" disabled={!newProfileName.trim()}>
                    Save
                  </NeuButton>
                </div>
              </form>
            </NeuCard>
          </div>
        )}

        {/* Edit Profile Modal */}
        {editingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-neu-base/80 backdrop-blur-sm p-4 animate-fade-in">
            <NeuCard className="w-full max-w-md">
              <h2 className="text-2xl font-bold text-neu-text mb-6">Edit Profile</h2>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="flex flex-col items-center mb-6">
                    <div className="relative w-24 h-24 mb-4">
                        <img src={editAvatar} alt="Preview" className="w-full h-full rounded-full shadow-neu-out object-cover" />
                        <button 
                            type="button"
                            onClick={randomizeEditAvatar}
                            className="absolute bottom-0 right-0 p-2 bg-neu-base rounded-full shadow-neu-btn hover:text-neu-accent transition-all"
                            title="Randomize Avatar"
                        >
                            <RefreshCw size={16} className={isSpinning ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>
                <div className="relative">
                   <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                   <NeuInput 
                     autoFocus
                     placeholder="Name" 
                     value={editName}
                     onChange={(e) => setEditName(e.target.value)}
                     className="pl-12"
                   />
                </div>
                <div className="flex space-x-4">
                  <NeuButton type="button" onClick={() => setEditingProfile(null)} className="flex-1">
                    Cancel
                  </NeuButton>
                  <NeuButton type="submit" variant="primary" className="flex-1" disabled={!editName.trim()}>
                    Update
                  </NeuButton>
                </div>
              </form>
            </NeuCard>
          </div>
        )}
      </div>
    </div>
  );
};