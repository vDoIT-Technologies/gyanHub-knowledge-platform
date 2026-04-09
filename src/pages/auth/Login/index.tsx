import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
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
import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { getErrorMessage, getSuccessMessage } from "@/lib/helpers/get-message";
import PageLoader from "@/components/template/PageLoader";
import { useTokenStore, useUserStore } from "@/store";
import { apiGetProfile } from "@/services/user.api";
import { useQuery } from "react-query";

import { LockKeyhole, Mail } from "lucide-react";
const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This is required" })
    .email("Invalid email"),
  password: z.string().min(1, { message: "This is required" }),
  remember: z.boolean().optional(),
});

const index = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const location = useLocation();

  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const {
    signIn,
    isSignInPending,
    signInData,
    verifyAccount,
    verifyData,
    isVerifyPending,
  } = useAuth();

  const { token, setToken } = useTokenStore();
  const { setAuthenticated, setUser, isAuthenticated } = useUserStore();
  const authtoken = searchParams.get("authtoken");
  const { isSuccess: isAccountVerified, data: accountVerificationData } =
    verifyData;
  
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    data,
    isLoading: isPending,
    isError: isWalletLoginError,
    error: walletLoginError,
    refetch,
  } = useQuery("profile", apiGetProfile, {
    enabled: false,
    onSuccess: (data) => {
   
      setUser(data?.data?.data);
      setAuthenticated(true);
      navigate(PATHS.HOME);
    },
    onError: () => {
      setToken(null);
    },
  });

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      verifyAccount({ token });
    }
  }, []);

  useEffect(() => {
    if (authtoken) {
      setToken(authtoken);
    }
  }, [authtoken]);
  
  useEffect(() => {
    if (authtoken && token) {
      refetch();
    }
  }, [authtoken, token])

  useEffect(() => {
    if (isAccountVerified) {
      setShowSuccess(false);
    }
  }, [isAccountVerified]);

  const handleLogin = async (data: z.infer<typeof loginFormSchema>) => {
    await signIn(data as any).then((res) => {
      if (res?.data?.success) {
        setUser(res?.data?.data?.UserInfo);
        setToken(res?.data?.data?.token);
      }
    });
  };

  if (isVerifyPending || isPending) {
    return <PageLoader />;
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleLogin)}
          className="flex flex-col space-y-6"
        >
          <div className="text-center space-y-2">
            <h2>Login to GyaanHub</h2>
            <p className="text-stone-500">
              Sign in with your username and password to access your account.
            </p>
          </div>
          {showSuccess && (
            <Alert variant="success">
              {getSuccessMessage(accountVerificationData)}
            </Alert>
          )}
            {(signInData?.isError ||
            verifyData?.isError ||
            isWalletLoginError) && (
            <Alert variant="destructive">
              {getErrorMessage(
                signInData?.isError
                  ? signInData.error
                  : verifyData?.isError
                    ? verifyData.error
                    : isWalletLoginError
                      ? walletLoginError
                      : null
              )}
            </Alert>
          )}
          <div className="space-y-4">
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
                        autoComplete="off"
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
                        autoComplete="off"
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
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Remember me</FormLabel>
                  </FormItem>
                )}
              />
              <Link
                to={PATHS.FORGET_PASSWORD}
                className="text-primary font-medium text-sm"
              >
                Forgot Password ?
              </Link>
            </div>
          </div>
          <Button loading={isSignInPending} type="submit" className="w-full">
            Login
          </Button>
          
          <p className="text-center font-light">
            New User?&nbsp;
            <Link to={PATHS.SIGNUP} className="font-medium text-primary">
              Sign Up
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
};

export default index;
