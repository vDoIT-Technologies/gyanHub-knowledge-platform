import api from "@/services";

export const apiRegister = async (payload: {
  email: string;
  password: string;
  name: string;
}) => {
  const params = new URLSearchParams();
  params.append("email", payload.email);
  params.append("password", payload.password);
  params.append("name", payload.name);

  return await api.post("/userauth/register", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const apiSignIn = async (payload: {
  email: string;
  password: string;
}) => {
  return await api.post(
    "/userauth/login",
    {},
    {
      auth: {
        username: payload.email,
        password: payload.password,
      },
    }
  );
};

export const apiVerifyAccount = async (payload: { token: string }) => {
  return await api.post(
    "/userauth/verify-account",
    {
      token: payload.token,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const apiForgotPassword = async (email: string) => {
  return await api.post("/userauth/forgot-password", { email });
};

export const apiResetPassword = async (payload: {
  token: string;
  password: string;
}) => {
  return await api.post("/userauth/reset-password", payload);
};
