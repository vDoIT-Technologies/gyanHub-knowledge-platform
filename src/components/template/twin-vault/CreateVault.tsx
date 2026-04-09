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

import { Mail } from "lucide-react";

const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This is required" })
    .email("Invalid email"),
});

export default function CreateVault({
  createVaultModalOpen,
  setCreateVaultModalOpen,
}: {
  createVaultModalOpen: boolean;
  setCreateVaultModalOpen: (val: boolean) => void;
}) {
  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleFormSubmit = (data: z.infer<typeof loginFormSchema>) => {
    console.log("email submitted:", data.email);
    setCreateVaultModalOpen(false);
  };

  return (
    <Dialog
      open={createVaultModalOpen}
      onOpenChange={setCreateVaultModalOpen}
    >
      <DialogContent className="sm:max-w-xl h-80 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-600/80">
        <DialogHeader>
          <DialogTitle className="text-center text-white text-2xl">
            Create new Vault Id
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6 w-72 md:w-96 mx-auto"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute text-bold left-3 top-1/2 transform -translate-y-1/2 text-white"
                      />
                      <Input
                        {...field}
                        type="email"
                        autoComplete="off"
                        placeholder="Enter Email ID"
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
                Create
              </Button>
            </div>
            <p className="text-center text-gray-200  text-sm mt-4">
              Already have an account?{" "}
              <span
                className="text-primary font-semibold cursor-pointer hover:underline"
                
              >
                Login
              </span>
            </p>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
