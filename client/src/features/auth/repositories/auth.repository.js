import { authAdapter } from "../adapter/auth.adapter";
import { authApi } from "../api/auth.api";

export const authRepository = {
  login: async (form) => authAdapter.toSession(await authApi.login(authAdapter.toLoginRequest(form))),
  register: async (form) => authAdapter.toUser((await authApi.register(authAdapter.toRegisterRequest(form))).user),
  logout: (refreshToken) => authApi.logout({ refreshToken }),
  me: async () => authAdapter.toUser((await authApi.me()).user),
  forgotPassword: async (email) =>
    authAdapter.toMessage(await authApi.forgotPassword(authAdapter.toForgotPasswordRequest(email))),
  resetPassword: async (form) =>
    authAdapter.toMessage(await authApi.resetPassword(authAdapter.toResetPasswordRequest(form))),
};
