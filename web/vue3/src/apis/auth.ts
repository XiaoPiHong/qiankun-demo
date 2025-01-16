import request from "@/utils/request";

export const postAuthSignInByUsername = (data) => {
  return request.post({
    url: "/auth/sign-in-by-username",
    data,
  });
};

export const postAuthSignInByEmail = (data) => {
  return request.post({
    url: "/auth/sign-in-by-email",
    data,
  });
};

export const postAuthSendEmailForSignIn = (data) => {
  return request.post({
    url: "/auth/send-email-for-sign-in",
    data,
  });
};

export const getAuthProfile = (query = {}) => {
  return request.get({
    url: "/auth/profile",
    query,
  });
};
