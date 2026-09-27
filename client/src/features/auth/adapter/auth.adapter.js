export const authAdapter = {
  toLoginRequest: ({ email, password }) => ({ email, password }),
  toRegisterRequest: ({ name, email, password, goal }) => ({ name, email, password, readingGoal: goal }),
  toForgotPasswordRequest: (email) => ({ email }),
  toResetPasswordRequest: ({ token, password }) => ({ token, password }),
  toUser: (user) =>
    user && {
      id: user.id,
      email: user.email,
      name: user.name,
      readingGoal: user.readingGoal,
      createdAt: user.createdAt,
    },
  toSession: (data) => ({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: authAdapter.toUser(data.user),
  }),
  toMessage: (data) => ({ message: data.message, resetToken: data.resetToken }),
};
