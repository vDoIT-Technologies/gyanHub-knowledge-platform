import { Button } from "@/components/ui/button";

export const ConfirmationModal = ({ isOpen, onClose, onDelete }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
        <div className="flex flex-col justify-center items-center bg-gray-700/30 backdrop-blur-lg space-y-6 p-5 sm:p-6 rounded-xl shadow-lg max-w-md w-full min-h-[16rem] h-fit">
          <div>
            <h2 className="text-center">Are you sure?</h2>
            <p className="text-center my-4">
              The response will be permanently deleted.
            </p>
          </div>
          <div className="flex justify-center gap-4 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full max-w-[10rem] bg-transparent hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              className="w-full max-w-[10rem]"
              variant="destructive"
              onClick={() => {
                onDelete();
                onClose();
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  };
  