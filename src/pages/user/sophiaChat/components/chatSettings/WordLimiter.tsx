import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import WordLimitSlider from "./WordLimitSlider";
import { useState, useEffect } from "react";
import { useChatStore } from "@/store";

export default function WordLimiter({
  wordLimitModalOpen,
  setWordLimitModalOpen,
}: {
  wordLimitModalOpen: boolean;
  setWordLimitModalOpen: (val: boolean) => void;
}) {
  const { wordLimit, setWordLimit } = useChatStore();
  const [localWordLimit, setLocalWordLimit] = useState(wordLimit);
  useEffect(() => {
    if (wordLimitModalOpen) {
      setLocalWordLimit(wordLimit);
    }
  }, [wordLimitModalOpen, wordLimit]);

  const handleSetWordLimit = () => {
    setWordLimit(localWordLimit);
    setWordLimitModalOpen(false);
  };

  return (
    <Dialog open={wordLimitModalOpen} onOpenChange={setWordLimitModalOpen}>
      <DialogContent className="sm:max-w-xl h-72 md:h-80 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-600/80">
        <DialogHeader>
          <DialogTitle className="text-center text-white text-2xl md:text-3xl">
            Set Word Limit
          </DialogTitle>
        </DialogHeader>
        <div>
          <WordLimitSlider
            wordLimit={localWordLimit}
            setWordLimit={setLocalWordLimit}
          />
        </div>
        <div className="flex gap-4 justify-center">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="px-4 py-2 min-w-28"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="outline"
            className="px-4 py-2 min-w-28 bg-pink-600 text-white hover:bg-pink-700"
            onClick={handleSetWordLimit}
          >
            Set
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
