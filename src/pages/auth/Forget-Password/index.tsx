import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PATHS } from "@/constants/page-paths";
import { useAuth } from "@/lib/hooks/useAuth";
import { getErrorMessage, getSuccessMessage } from "@/lib/helpers/get-message";
import { Alert } from "@/components/ui/alert";
import { Mail } from "lucide-react";

const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This is required" })
    .email("Invalid email"),
});

const ForgetPassword = () => {
  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const { forgotPassword } = useAuth();

  const { mutateAsync, isError, isSuccess, data, isLoading, error } =
    forgotPassword;

  const handleFormSubmit = (data: z.infer<typeof loginFormSchema>) => {
    mutateAsync(data.email).then((res) => {
      if (res?.data?.success) {
        form.reset();
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-6 my-3"
        >
          <div className="text-center space-y-4">
            <h2>Forgot Password?</h2>
            <p className="text-stone-500">
              Enter your email to receive a password reset link.
            </p>
          </div>
          {isError && (
            <Alert variant="destructive">{getErrorMessage(error)}</Alert>
          )}
          {isSuccess && (
            <Alert variant="success">{getSuccessMessage(data)}</Alert>
          )}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                  <div className="relative">
                 
                 <Mail size={18} className="absolute text-bold left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
                    <Input
                     {...field}
                     type="email"
                     autoComplete="off"
                     placeholder="Enter your email"
                      className="pl-10"
                    />
                    </div>
                   
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-6">
            <Button loading={isLoading} variant="default">
              Continue
            </Button>
            <p className="text-center font-light">
              Back to&nbsp;
              <Link to={PATHS.LOGIN} className="font-medium text-primary">
                Log In
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ForgetPassword;
