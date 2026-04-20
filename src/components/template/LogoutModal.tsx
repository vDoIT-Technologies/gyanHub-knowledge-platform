import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/hooks/useAuth";
import { FiLogOut } from "react-icons/fi";
export default function LogoutModal({
  logoutModalOpen,
  setLogoutModalOpen,
}: {
  logoutModalOpen: boolean;
  setLogoutModalOpen: (val: boolean) => void;
}) {
  const { signOut } = useAuth();
  const handleLogout = () => {
    signOut();
    setLogoutModalOpen(false);
  };

  return (
    <Dialog open={logoutModalOpen} onOpenChange={setLogoutModalOpen}>
      <DialogContent className="sm:max-w-xl h-72 md:h-80 bg-secondary border-muted/30">
        <DialogHeader>
          <div className="flex flex-col items-center justify-center gap-4">
            <DialogTitle className="text-center text-foreground text-2xl md:text-3xl">
              Log out
            </DialogTitle>

            <FiLogOut className="text-primary text-4xl md:text-5xl" />
            <p className="text-center text-muted-foreground ">
              Are you sure you want to log out?
            </p>
          </div>
        </DialogHeader>

        <div className="flex gap-4 justify-center ">
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
            className="px-4 py-2 min-w-28 border-primary/40 bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
