import { useMutation, useQueryClient } from "react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiUpdateSession, apiDeleteSession } from "@/services/chat.api";
import { useState } from "react";
import { toast, Toaster } from "sonner";
const ChatSessionModal = ({
  session,
  isDeleteModalOpen,
  setDeleteModalOpen,
  isEditModalOpen,
  setEditModalOpen,
  onDropdownToggle,
}) => {
  const [newTitle, setNewTitle] = useState(session.title);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: () => apiDeleteSession(session.id),
    onSuccess: () => {
      setDeleteModalOpen(false);
      onDropdownToggle(false);
      queryClient.invalidateQueries(["chatSessions"]);
      toast.success("Session deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting session:", error);
      toast.error("Failed to delete this session");
      
    },
  });

  const updateMutation = useMutation({
    mutationFn: (newTitle: string) => {
      const finalTitle = newTitle.trim() === "" ? "New Chat" : newTitle;
      return apiUpdateSession(session.id, { title: finalTitle });
    },
    onSuccess: () => {
      setEditModalOpen(false);
      onDropdownToggle(false);
      queryClient.invalidateQueries(["chatSessions"]);
      toast.success("Session updated Successfully");
      
    },
    onError: (error) => {
      toast.error("Failed to update this session");
      console.error("Error updating session:", error);
    },
  });
  
  const handleDeleteConfirm = () => {
    onDropdownToggle(false)
    deleteMutation.mutate();
  };

  const handleEditSubmit = () => {
    onDropdownToggle(false)
    updateMutation.mutate(newTitle);
  };

  return (
    <>
      <Dialog open={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-600/80">
          <DialogHeader>
            <DialogTitle>Delete Session</DialogTitle>
            <p>
              Are you sure you want to delete the session titled{" "}
              <span className="font-semibold text-primary">
                "{session.title}"
              </span>{" "}
              ?
            </p>
          </DialogHeader>
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-6 justify-center my-3">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              loading={deleteMutation.isLoading}
              className="bg-pink-600 text-white w-full sm:w-auto"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isLoading} 
            >
              {deleteMutation.isLoading ? "Deleting..." : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Session Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent  className="sm:max-w-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-600/80">
          <DialogHeader>
            <DialogTitle>Edit Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label
                className="block text-sm font-medium text-gray-200 mb-1"
                htmlFor="session-title"
              >
                Session Title
              </label>
              <Input
                id="session-title"
                placeholder="Session Title"
                value={newTitle}
                maxLength={30}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 bg-black/20"
              />
              <p className="text-end text-gray-500 text-xs mt-2">{`${newTitle.length}/30`}</p>
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-6 justify-center my-3">
            <Button variant="outline" onClick={() => setEditModalOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              className="bg-primary text-white hover:bg-primary-dark w-full sm:w-auto"
              onClick={handleEditSubmit}
              disabled={updateMutation.isLoading}
              loading={updateMutation.isLoading}
            >
              {updateMutation.isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Toaster theme="dark" />
    </>
  );
};

export default ChatSessionModal;