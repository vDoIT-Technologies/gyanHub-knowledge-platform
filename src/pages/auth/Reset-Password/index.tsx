import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { PATHS } from "@/constants/page-paths";
import { getErrorMessage, getSuccessMessage } from "@/lib/helpers/get-message";
import { useAuth } from "@/lib/hooks/useAuth";

const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/\d/, { message: "Password must contain at least one number" })
      .regex(/[@$!%?&]/, {
        message:
          "Password must contain at least one special character (@$!%?&)",
      })
      .min(1, { message: "This is required" }),
    confirmPassword: z.string().min(1, { message: "This is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const index = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const form = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { resetPassword } = useAuth();

  const { mutateAsync, isError, isSuccess, data, isLoading, error } =
    resetPassword;

  const handleFormSubmit = (data: z.infer<typeof ResetPasswordSchema>) => {
 
    if (!token) {
      return;
    }
    mutateAsync({ token, password: data?.password }).then((res) => {
      if (res?.data?.success) {
        form.reset();
        setShowSuccessAlert(true);
      }
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setShowSuccessAlert(true);
      setTimeout(() => {
        navigate(PATHS.LOGIN, {
          replace: true,
          state: {
            message:
              getSuccessMessage(data) || "Your password has been updated",
          },
        });
      }, 2000);
    }
  }, [isSuccess]);

  if (!token) {
    return (
      <Navigate to={PATHS.FORGET_PASSWORD} replace state={{ invalid: true }} />
    );
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-6 my-3"
        >
          <div className="text-center space-y-2">
            <h2>Create New Password</h2>
            <p className="text-stone-500">
              Enter a new password to update your account.{" "}
            </p>
          </div>
          {isError && (
            <Alert variant="destructive">{getErrorMessage(error)}</Alert>
          )}
          {showSuccessAlert && (
            <Alert variant="success">{getSuccessMessage(data)}</Alert>
          )}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Enter New Password"
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Confirm New Password"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-6">
            <Button type="submit" loading={isLoading}>
              Submit
            </Button>
            <p className="text-center font-light">
              Back to{" "}
              <Link to={PATHS.LOGIN} className="font-medium text- text-primary">
                Log In
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </>
  );
};

export default index;
