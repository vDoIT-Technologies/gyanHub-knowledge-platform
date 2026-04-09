import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useChatStore } from "@/store";
import { useState } from "react";
import { useEffect } from "react";

// llm options
const checkboxOptions = [
  { id: "My Vault", label: "My Vault" },
  { id: "gpt-4", label: "GPT-4" },
  { id: "gpt-4o", label: "GPT-4o" },
  { id: "gpt-4o-mini", label: "GPT-4o mini" },
  { id: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
];

export default function VaultModal({
  vaultModalOpen,
  setVaultModalOpen,
}: {
  vaultModalOpen: boolean;
  setVaultModalOpen: (val: boolean) => void;
}) {
  const { llm, setLlm } = useChatStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(llm);
  useEffect(() => {
    if (vaultModalOpen) {
      setSelectedOption(llm);
    }
  }, [vaultModalOpen, llm]);
  const handleCheckboxChange = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleSave = () => {
    if (selectedOption) {
      setLlm(selectedOption);
    }
    setVaultModalOpen(false);
  };

  return (
    <Dialog open={vaultModalOpen} onOpenChange={setVaultModalOpen}>
      <DialogContent className="sm:max-w-xl h-72 md:h-80 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-600/80">
        <DialogHeader>
          <DialogTitle className="text-center text-white text-2xl md:text-3xl">
            Select Vault Type
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center">
          {checkboxOptions.map((option) => (
            <div key={option.id} className="flex items-center gap-2">
              <label
                htmlFor={option.id}
                className="text-white text-md min-w-52"
              >
                {option.label}
              </label>
              <Checkbox
                id={option.id}
                checked={selectedOption === option.id}
                onCheckedChange={() => handleCheckboxChange(option.id)}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
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
