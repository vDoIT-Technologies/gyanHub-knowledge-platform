import ChatBox from "./components/ChatBox";
import { useQuery } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import {
  apiGetPersonalityById,
  apiGetPersonalityList,
} from "@/services/personality.api";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { MessageCirclePlus } from "lucide-react";

import reflection from "/reflection_of_light.jpg";
import prism from "/prism.jpg";

const Chats = () => {
  const { assistantId: paramAssistantId } = useParams();
  const navigate = useNavigate();

  const assistantId = paramAssistantId || import.meta.env.VITE_SOPHIA_ID;

  const { data: items } = useQuery(
    ["fetchPersonalities"],
    apiGetPersonalityList,
    { refetchOnWindowFocus: false }
  );

  const allowedIds = [
    "63f3f3e9-f3a7-40fa-b107-8556344ad309",
    "8b9b2d51-df7f-40cc-9390-3ded80a2a3e0",
  ];

  const assistants = (items?.data?.data || []).filter((a) =>
    allowedIds.includes(a.id)
  );

  const [selectedPersonalityId, setSelectedPersonalityId] =
    useState(assistantId);

  const { data, isLoading } = useQuery(
    ["getPersonalityById", selectedPersonalityId],
    () => apiGetPersonalityById(selectedPersonalityId),
    { enabled: !!selectedPersonalityId }
  );

  const personalityInfo = data?.data?.data || null;

  const handleNewChat = () => {
    navigate(
      personalityInfo?.personalityId
        ? `/chat/${personalityInfo.personalityId}?new=true`
        : `/chat?new=true`
    );
  };

  const images = [
    reflection,              // 0
    prism,                   // 1
    "/photosynthesis.jpg",   // 2
    "/cell_structure.jpg",   // 3
    "/atom.jpg",             // 4
    "/solar_system.jpg",     // 5
    "/magnetism.jpg",        // 6
    "/dna.png",              // 7
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(null);

  const handleSophiaMessage = useCallback((text: string) => {
    if (!text) return;
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes("reflection") || lowerText.includes("reflected") || lowerText.includes("reflects") || lowerText.includes("reflect") || lowerText.includes("light")) {
      setCurrentImageIndex(0);
    } 
    else if (lowerText.includes("prism") || lowerText.includes("prisms") || lowerText.includes("prismatic")) {
      setCurrentImageIndex(1);
    }
    else if (lowerText.includes("photosynthesis") || lowerText.includes("chlorophyll") ) {
      setCurrentImageIndex(2);
    }
    else if (lowerText.includes("cell") && (lowerText.includes("structure") || lowerText.includes("cells"))) {
      setCurrentImageIndex(3);
    }
    else if (lowerText.includes("atom") || lowerText.includes("molecule") || lowerText.includes("neutron") || lowerText.includes("proton") || lowerText.includes("electron")) {
      setCurrentImageIndex(4);
    }
    else if (lowerText.includes("solar system") || lowerText.includes("planet") || lowerText.includes("orbit") || lowerText.includes("sun") || lowerText.includes("moon") || lowerText.includes("star") || lowerText.includes("galaxy") || lowerText.includes("universe") || lowerText.includes("earth") || lowerText.includes("mars") || lowerText.includes("jupiter") || lowerText.includes("saturn") || lowerText.includes("uranus") || lowerText.includes("neptune") || lowerText.includes("pluto") || lowerText.includes("comet") || lowerText.includes("asteroid") || lowerText.includes("meteor") || lowerText.includes("black hole") || lowerText.includes("supernova") || lowerText.includes("nebula") || lowerText.includes("galaxy") || lowerText.includes("universe") || lowerText.includes("earth") || lowerText.includes("mars") || lowerText.includes("jupiter") || lowerText.includes("saturn") || lowerText.includes("uranus") || lowerText.includes("neptune") || lowerText.includes("pluto") || lowerText.includes("comet") || lowerText.includes("asteroid") || lowerText.includes("meteor") || lowerText.includes("black hole") || lowerText.includes("supernova") || lowerText.includes("nebula")) {
      setCurrentImageIndex(5);
    }
    else if (lowerText.includes("magnet") || lowerText.includes("magnetic field")) {
      setCurrentImageIndex(6);
    }
    else if (lowerText.includes("dna") || lowerText.includes("genetic") || lowerText.includes("chromosome")) {
      setCurrentImageIndex(7);
    }
    else {
      setCurrentImageIndex(null);
    }
  }, []);

  const currentImage = images[currentImageIndex];

  /* ------------------------------------------------------ */

  return (
    <div className="flex flex-col lg:flex-row h-[85vh] md:min-h-[88vh] w-full relative overflow-hidden bg-background">
      {/* Left Panel */}
      <div className="flex-1 flex flex-col relative h-full">
        <div className="absolute top-4 left-4 z-20">
          <Button
            onClick={handleNewChat}
            className="gap-2 bg-secondary/80 backdrop-blur-md hover:bg-secondary text-foreground shadow-sm"
            size="sm"
            variant="ghost"
          >
            <MessageCirclePlus className="w-4 h-4" />
            <span className="hidden sm:inline">New Class</span>
          </Button>
        </div>

        <ChatBox 
          personality={personalityInfo} 
          isImageLoading={isLoading} 
          onSophiaMessage={handleSophiaMessage}
        />
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex flex-col w-[400px] h-full">
        {/* Top Half */}
        <div className="h-1/2 w-full p-6 flex items-center justify-center">
          <div className="w-full h-full rounded-2xl bg-secondary/20 border border-border/50 flex items-center justify-center overflow-hidden">
            {currentImage ? (
              <img
                src={currentImage}
                alt="Class material"
                className="w-full h-full object-contain transition-opacity duration-500"
              />
            ) : (
              <div className="h-full w-full p-6 flex flex-col gap-4 justify-center items-center relative">
                {/* Placeholder for "Images" section */}
                <div className="w-full h-full rounded-2xl bg-secondary/20 flex flex-col items-center justify-center p-4 border border-border/50">
                  <div className="p-4 rounded-full bg-primary/10 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-image-plus text-primary w-8 h-8"
                    >
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                      <line x1="16" x2="22" y1="5" y2="5" />
                      <line x1="19" x2="19" y1="2" y2="8" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Class Materials
                  </p>
                  <p className="text-xs text-muted-foreground/60 text-center mt-2 max-w-[200px]">
                    Images and diagrams will appear here during the lesson
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Half */}
        <div className="h-1/2 w-full relative overflow-hidden flex items-end justify-center">
          <img
            src="/img/teachers.png"
            alt="AI Assistant"
            className="w-full h-full object-cover object-top opacity-90"
          />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default Chats;
