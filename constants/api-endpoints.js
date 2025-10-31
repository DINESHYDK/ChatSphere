export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: "/api/auth/signUp",
    SIGNIN: "/api/auth/signIn",
    LOGOUT: "/api/auth/logout",
    FORGOT_PASSWORD: "/api/auth/forgotPassword",
    RESET_PASSWORD: "/api/auth/resetPassword?token=", // *** {Token will be provided here} ***
    VERIFY_EMAIL: "/api/auth/verify-email?token=",
    VERIFY_OTP: "/api/auth/verify-otp",
    VERIFY_RESET_TOKEN: "/api/auth/verify-reset-token?token=", // *** {Token will be provided} ***
    UPDATE_USER: "/api/auth/update", // to be done
  },
  MESSAGES: {
    SAVE_GLOBAL_MESSAGES: "/api/chat/save-global-messages",
    SAVE_PRIVATE_MESSAGES: "/api/chat/save-private-messages",
  },
  POLLS: {
    SAVE_POLL: "api/poll/save-poll",
    SAVE_POLL_VOTES: "/api/poll/save-poll-votes",
  },
};
