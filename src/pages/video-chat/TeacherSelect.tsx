import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video, Lock, Sparkles, Users, Loader2 } from "lucide-react";
import { apiGetAvatarTeachers, AvatarTeacherPublic } from "@/services/chat.api";

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: AvatarTeacherPublic;
}

const TopicModal = ({ isOpen, onClose, teacher }: TopicModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const topics = teacher.topics || [];

  const handleSelectTopic = (topic: string) => {
    navigate(`/avatar-chat/${teacher.id}?topic=${encodeURIComponent(topic)}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-lg bg-[#10111a] border border-white/10 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <Lock size={20} className="rotate-45" /> {/* Close icon using available icons */}
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-500">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Select a Topic</h3>
            <p className="text-sm text-slate-400">Choose what you want to learn with {teacher.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {topics.length === 0 ? (
            <div className="py-8 text-center bg-white/5 rounded-2xl">
              <p className="text-slate-400">No specific topics listed. Let's start with a general lesson!</p>
              <button
                onClick={() => handleSelectTopic("General Lesson")}
                className="mt-4 px-6 py-2 bg-pink-600 text-white rounded-full font-bold hover:bg-pink-500 transition-all"
              >
                Start Session
              </button>
            </div>
          ) : (
            topics.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectTopic(topic)}
                className="w-full text-left p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-pink-500/50 hover:bg-pink-500/5 transition-all group flex items-center justify-between"
              >
                <span className="text-slate-200 group-hover:text-white font-medium">{topic}</span>
                <Video size={14} className="text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const TeacherCard = ({ teacher }: { teacher: AvatarTeacherPublic }) => {
  const [showTopics, setShowTopics] = useState(false);
  const isActive = teacher.isActive;

  return (
    <>
      <div
        onClick={() => isActive && setShowTopics(true)}
        className={`relative rounded-2xl overflow-hidden h-[380px] flex flex-col border transition-all duration-300
          ${
            isActive
              ? "border-white/10 cursor-pointer hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(228,56,122,0.25)] hover:border-pink-500/35"
              : "border-white/8 cursor-default opacity-75"
          }
          bg-[#10111a] group`}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={teacher.imageUrl || "/img/teachers.png"}
            alt={teacher.name}
            className={`w-full h-full object-cover object-top transition-transform duration-500
              ${isActive ? "group-hover:scale-105" : "saturate-50 brightness-75"}`}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12]/95 via-[#0a0a12]/50 to-transparent" />
        </div>

        {/* Active badge */}
        {isActive && (
          <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 bg-black/65 backdrop-blur-sm border border-green-500/50 text-green-400 text-[0.68rem] font-bold tracking-widest px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Active
          </div>
        )}

        {/* Lock overlay for inactive */}
        {!isActive && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/35 backdrop-blur-[1px] pb-20">
            <Lock size={28} className="text-white/50" />
            <span className="text-[0.8rem] font-semibold text-white/45 uppercase tracking-widest">
              Coming Soon
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col gap-3 p-4 pb-5">
          <div>
            <h3 className="text-[1.1rem] font-bold text-white m-0 leading-snug">
              {teacher.name}
            </h3>
            <p className="text-[0.78rem] text-slate-400 m-0 mt-0.5 leading-snug line-clamp-2">
              {teacher.description}
            </p>
          </div>

          <button
            disabled={!isActive}
            onClick={(e) => {
              e.stopPropagation();
              if (isActive) setShowTopics(true);
            }}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-sm font-semibold transition-all duration-200 border-none
              ${
                isActive
                  ? "bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white shadow-[0_4px_16px_rgba(228,56,122,0.35)] hover:shadow-[0_6px_20px_rgba(228,56,122,0.5)] hover:scale-[1.02] cursor-pointer"
                  : "bg-white/8 text-white/35 cursor-not-allowed"
              }`}
          >
            {isActive ? (
              <>
                <Video size={15} />
                Enter Video Chat
              </>
            ) : (
              <>
                <Lock size={15} />
                Coming Soon
              </>
            )}
          </button>
        </div>
      </div>

      <TopicModal 
        isOpen={showTopics} 
        onClose={() => setShowTopics(false)} 
        teacher={teacher} 
      />
    </>
  );
};

const TeacherSelect = () => {
  const [teachers, setTeachers] = useState<AvatarTeacherPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetAvatarTeachers()
      .then(setTeachers)
      .catch((err) => console.error("Failed to fetch teachers:", err))
      .finally(() => setLoading(false));
  }, []);

  const activeCount = teachers.filter((t) => t.isActive).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
        <p className="text-slate-400 font-medium">Loading available teachers...</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-pink-900 text-white flex-shrink-0">
          <Sparkles size={18} />
        </div>
        <div>
          <h2 className="text-[1.75rem] font-bold text-white m-0 mb-0.5">
            Choose Your AI Teacher
          </h2>
          <p className="text-[0.9rem] text-slate-400 m-0">
            Select a teacher to start your live avatar class session
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-1.5 text-[0.8rem] text-slate-400">
          <Users size={15} />
          <span>
            {activeCount} Teacher{activeCount !== 1 ? "s" : ""} Active
          </span>
        </div>
        <div className="w-px h-4 bg-white/15" />
        <div className="flex items-center gap-1.5 text-[0.8rem] text-slate-400">
          <Video size={15} />
          <span>Avatar-Powered Sessions</span>
        </div>
      </div>

      {/* Teacher grid */}
      {teachers.length === 0 ? (
        <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-slate-400 text-lg">No teachers available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherSelect;

