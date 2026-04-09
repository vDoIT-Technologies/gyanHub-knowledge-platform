import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/constants/page-paths";
import { useTokenStore, useUserStore } from "@/store";
import {
  apiForgotPassword,
  apiRegister,
  apiResetPassword,
  apiSignIn,
  apiVerifyAccount,
} from "@/services/auth.api";

export const useAuth = () => {
  const { token, setToken } = useTokenStore();
  const { setAuthenticated, setUser, isAuthenticated } = useUserStore();
  const navigate = useNavigate();

  const registerUser = useMutation({
    mutationFn: apiRegister,
  });

  const {
    mutateAsync: signIn,
    isLoading: isSignInPending,
    ...signInData
  } = useMutation({
    mutationFn: apiSignIn,
    onSuccess: (res) => {
      const { token, ...userInfo } = res.data.data;
      setToken(token);
      setAuthenticated(true);
      setUser(userInfo);
      navigate(PATHS.HOME, { replace: true });
    },
  });

  const {
    mutateAsync: verifyAccount,
    isLoading: isVerifyPending,
    ...verifyData
  } = useMutation({
    mutationFn: apiVerifyAccount,
  });

  const signOut = () => {
    window.postMessage(
      {
        action: "addTransaction",
        payload: {
          id: "1",
          isLogin: false,
          status: true,
          expireInSecond: 1,
          jwtToken: "",
        },
      },
      "*"
    );
    setAuthenticated(false);
    setUser(null);
    setToken(null);
    navigate(PATHS.LOGIN, { replace: true });
  };

  const forgotPassword = useMutation({
    mutationFn: apiForgotPassword,
  });

  const resetPassword = useMutation({
    mutationFn: apiResetPassword,
  });

  return {
    registerUser,
    token,
    setToken,
    verifyAccount,
    isVerifyPending,
    verifyData,
    signIn,
    isSignInPending,
    signInData,
    signOut,
    forgotPassword,
    resetPassword,
  };
};
