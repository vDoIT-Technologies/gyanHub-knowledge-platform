import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const otpFormSchema = z.object({
  otp: z.string().min(6, { message: "This is required" }),
});

export default function Verify({
  verifyModalOpen,
  setVerifyModalOpen,
}: {
  verifyModalOpen: boolean;
  setVerifyModalOpen: (val: boolean) => void;
}) {
  const form = useForm({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleFormSubmit = (data: z.infer<typeof otpFormSchema>) => {
    console.log("OTP submitted:", data.otp);
    setVerifyModalOpen(false);
  };

  return (
    <Dialog open={verifyModalOpen} onOpenChange={setVerifyModalOpen}>
      <DialogContent className="sm:max-w-xl h-80 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-600/80 p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-white text-2xl">
            OTP Verification
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6 w-72 md:w-96 mx-auto"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center gap-2">
                  <FormControl>
                    <InputOTP {...field} maxLength={6}>
                      <InputOTPGroup className="flex gap-2">
                        {" "}
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="w-12 h-12 text-center border border-gray-600 rounded-md bg-gray-800 text-white"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
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
                  onClick={() => form.reset()}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="outline"
                className="px-4 py-2 min-w-28 bg-primary text-white hover:bg-pink-700"
              >
                Submit
              </Button>
            </div>
            <p className="text-center text-sm text-gray-200 mt-4">
              Back to{" "}
              <span className="text-primary font-semibold cursor-pointer hover:underline">
                Create Vault
              </span>
            </p>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
