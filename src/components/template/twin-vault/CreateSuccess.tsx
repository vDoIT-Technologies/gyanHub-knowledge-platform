import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { motion } from "framer-motion";
export default function CreateSuccess({
  createSuccessModalOpen,
  setCreateSuccessModalOpen,
}: {
  createSuccessModalOpen: boolean;
  setCreateSuccessModalOpen: (val: boolean) => void;
}) {
  return (
    <Dialog
      open={createSuccessModalOpen}
      onOpenChange={setCreateSuccessModalOpen}
    >
      <DialogContent className="sm:max-w-xl h-80 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-600/80">
        <DialogClose asChild>
          <button
            className="absolute top-3 right-3 text-gray-300 hover:text-white"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </DialogClose>
        <DialogHeader className="text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center gap-4"
            >
              {/* Animated Image */}
              <motion.img
                src="/img/success.svg"
                alt="Success"
                className="w-24 h-24 object-contain"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              <DialogTitle className="text-white text-2xl md:text-3xl">
                Success!
              </DialogTitle>
              <p className="text-white text-sm md:text-md text-center">
                Congratulations! Your account has been created successfully.
              </p>
              <p className="text-primary text-xs md:text-sm text-center">
                Your vault ID has been sent to your email.
              </p>
            </motion.div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
