import request from "@/utils/request";

export const postOauthToken = (data) => {
  return request.post({
    url: "/oauth/token",
    data,
  });
};
