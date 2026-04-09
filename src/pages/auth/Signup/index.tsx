import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { PATHS } from "@/constants/page-paths";
import { useAuth } from "@/lib/hooks/useAuth";
import { Alert } from "@/components/ui/alert";
import { getErrorMessage, getSuccessMessage } from "@/lib/helpers/get-message";
import { Mail, User, LockKeyhole } from "lucide-react";
const SignUpFormSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "This is required" })
      .max(40, { message: "Name must not exceed 40 characters" }),
    email: z
      .string()
      .min(1, { message: "This is required" })
      .email("Invalid email format"),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
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
      .regex(/^\S*$/, {
        message: "Password must not contain spaces",
      }),
    confirmPassword: z.string().min(1, { message: "This is required" }),
    termsCondition: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms & Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { registerUser } = useAuth();

  const { mutateAsync, isLoading, isError, error, isSuccess, data } =
    registerUser;

  const form = useForm({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsCondition: false,
    },
  });

  const handleSignup = async (data: z.infer<typeof SignUpFormSchema>) => {
    await mutateAsync({
      name: data.name,
      email: data.email,
      password: data.password,
    }).then((res) => {
      if (res?.data?.success) {
        form.reset();
      }
    });
  };

  const hasAlert = isError || isSuccess;

  return (
    <>
      {isError && <Alert variant="destructive">{getErrorMessage(error)}</Alert>}
      {isSuccess && (
        <div className="text-center space-y-6">
          <h2>Verification Link Sent!</h2>
          <Alert variant="success">{getSuccessMessage(data)}</Alert>
        </div>
      )}

      {!hasAlert && (
        <Form {...form}>
          <div className="text-center space-y-2 mb-6">
            <h2>Sign Up to GyaanHub</h2>
            <p className="text-stone-500">Create an account to get started.</p>
          </div>
          <form
            onSubmit={form.handleSubmit(handleSignup)}
            className="flex flex-col space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <User
                          size={18}
                          className="absolute text-bold left-3 top-1/2 transform -translate-y-1/2 text-stone-400"
                        />
                        <Input
                          required
                          {...field}
                          type="text"
                          placeholder="Enter Name"
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Mail
                          size={18}
                          className="absolute text-bold left-3 top-1/2 transform -translate-y-1/2 text-stone-400"
                        />
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter Email"
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <LockKeyhole
                          size={18}
                          className="absolute text-bold left-3 top-1/2 transform -translate-y-1/2 text-stone-400 z-10"
                        />
                        <PasswordInput
                          {...field}
                          placeholder="Enter Password"
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <LockKeyhole
                          size={18}
                          className="absolute text-bold left-3 top-1/2 transform -translate-y-1/2 text-stone-400 z-10"
                        />
                        <PasswordInput
                          {...field}
                          placeholder="Confirm Password"
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="termsCondition"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">
                        Agree to Terms & Conditions
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button loading={isLoading} type="submit" className="w-full">
              Sign Up
            </Button>
            
          </form>
        </Form>
      )}
      <p className="text-center font-light pt-6">
        Existing User?&nbsp;
        <Link to={PATHS.LOGIN} className=" font-medium text-primary">
          Log In
        </Link>
      </p>
    </>
  );
};

export default index;
