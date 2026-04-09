import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { FaWallet } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const walletFormSchema = z.object({
  walletId: z
    .string()
    .min(1, { message: "This is required" })
});

export default function ConnectVault({
  connectVaultModalOpen,
  setConnectVaultModalOpen,
}: {
  connectVaultModalOpen: boolean;
  setConnectVaultModalOpen: (val: boolean) => void;
}) {
  const form = useForm({
    resolver: zodResolver(walletFormSchema),
    defaultValues: {
      walletId: "",
    },
  });

  const handleFormSubmit = (data: z.infer<typeof walletFormSchema>) => {
    console.log("Wallet ID submitted:", data.walletId);
    setConnectVaultModalOpen(false);
  };

  return (
    <Dialog
      open={connectVaultModalOpen}
      onOpenChange={setConnectVaultModalOpen}
    >
      <DialogContent className="sm:max-w-xl h-80 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-600/80">
        <DialogHeader>
          <DialogTitle className="text-center text-white text-2xl">
            Connect to Twin Vault
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6 w-72 md:w-96 mx-auto"
          >
            <FormField
              control={form.control}
              name="walletId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <FaWallet
                        size={18}
                        className="absolute text-bold left-3 top-1/2 transform -translate-y-1/2 text-white"
                      />
                      <Input
                        {...field}
                        type="text"
                        autoComplete="off"
                        placeholder="Enter your wallet ID"
                        className="text-white bg-gray-900 border-gray-600 placeholder-gray-500 pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4 justify-center">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="px-4 py-2 min-w-28"
                  onClick={()=>form.reset()}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="outline"
                className="px-4 py-2 min-w-28 bg-pink-600 text-white hover:bg-pink-700"
              >
                Connect
              </Button>
            </div>
            <p className="text-center text-gray-200 text-sm mt-4">
              Don’t have a vault?{" "}
              <span
                className="text-primary font-semibold cursor-pointer hover:underline"
                
              >
                Create
              </span>
            </p>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
