import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useChatStore } from "@/store"; 

export default function ModeSelectionModal({
  modeSelectionModalOpen,
  setModeSelectionModalOpen,
}: {
  modeSelectionModalOpen: boolean;
  setModeSelectionModalOpen: (val: boolean) => void;
}) {
  const { chatMode, setChatMode } = useChatStore();
  const [selectedMode, setSelectedMode] = useState(chatMode || ""); 
  const handleCardClick = (mode: string) => {
    setSelectedMode(mode);
  };
  useEffect(() => {
    if (modeSelectionModalOpen) {
      setSelectedMode(chatMode);
    }
  }, [modeSelectionModalOpen, chatMode]);
  const handleSave = () => {
    setChatMode(selectedMode); 
    setModeSelectionModalOpen(false); 
  };

  const cards = [
    {
      mode: "Text",
      points: 1,
    },
    {
      mode: "Audio",
      points: 2,
    },
    {
      mode: "Video",
      points: 3,
    },
  ];

  return (
    <Dialog
      open={modeSelectionModalOpen}
      onOpenChange={setModeSelectionModalOpen}
    >
      <DialogContent className="sm:max-w-xl h-auto md:h-80 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-600/80 overflow-auto md:overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-center font-semibold text-white text-2xl md:text-3xl">
           Change Chat Mode
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 md:flex-row md:justify-center">
          {cards.map((card) => (
            <div
              key={card.mode}
              className={`flex flex-row md:flex-col items-center justify-between gap-2 p-4 md:p-4 border-none rounded-lg transition-colors duration-200 text-white shadow-xl  ${
                selectedMode === card.mode
                  ? "bg-gradient-to-r from-pink-900 via-pink-600 to-pink-900"
                  : "bg-muted/80"
              } cursor-pointer`}
              onClick={() => handleCardClick(card.mode)}
            >
              <h3>{card.mode}</h3>
              <p className="text-sm">{`${card.points} Soph/Question`}</p>
              <Button
                variant="outline"
                className={` ${
                  selectedMode === card.mode ? "bg-muted" : "bg-black/30"
                }`}
              >
                {selectedMode === card.mode ? "Selected" : "Select"}
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-center my-3">
          <DialogClose asChild>
            <Button variant="outline" className="px-4 py-2 min-w-28">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="outline"
            className="px-4 py-2 min-w-28 bg-pink-600 text-white hover:bg-pink-700"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
