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
  POLLS: {
    SAVE_POLL: "api/poll/save-poll",
    SAVE_POLL_VOTES: "/api/poll/save-poll-votes",
  },
  CHAT: {
    GLOBAL: {
      FETCH_GLOBAL_MESSAGES: "api/chat/global/fetch-messages", // *** api/chat/global/fetch-messages?limit=...&id=... ***
      SAVE_GLOBAL_MESSAGES: "api/chat/global/save-messages",
    },
    PRIVATE: {
      FETCH_MESSAGES: "api/chat/private-chat/fetch-messages", // *** api/chat/private-chat/fetch-messages?limit=...&id=... ***
      SAVE_PRIVATE_MESSAGES: "api/chat/global/save-messages",
    },
  },
};
