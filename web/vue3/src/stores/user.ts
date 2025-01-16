import { defineStore } from "pinia";
import { ref } from "vue";
import * as apisAuth from "@/apis/auth";
import * as apisOauth from "@/apis/oauth";

export default defineStore(
  "user",
  () => {
    const accessToken = ref("");
    const refreshToken = ref("");
    const tokenType = ref("");
    const user = ref<any>(null);
    const username = ref("");
    const email = ref("");
    const mobile = ref("");

    const permissionCodeMap = computed(() => {
      return Object.fromEntries(
        (user.value?.permissionCodes ?? []).map((item) => [item, true])
      );
    });

    const login = (data) => {
      accessToken.value = data.access_token;
      refreshToken.value = data.refresh_token;
      tokenType.value = data.token_type;
    };

    const logout = () => {
      accessToken.value = "";
      refreshToken.value = "";
      tokenType.value = "";
      user.value = null;
    };

    const postRefreshToken = () => {
      const { VITE_CLIENT_ID } = import.meta.env;

      return apisOauth
        .postOauthToken({
          grant_type: "refresh_token",
          client_id: VITE_CLIENT_ID,
          refresh_token: refreshToken.value,
        })
        .then((res) => {
          const { data } = res;
          accessToken.value = data.access_token;
          refreshToken.value = data.refresh_token;
          tokenType.value = data.token_type;
        });
    };

    const getProfile = () => {
      return apisAuth.getAuthProfile().then((res) => {
        user.value = res.data;
      });
    };

    return {
      accessToken,
      refreshToken,
      tokenType,
      user,
      username,
      email,
      mobile,
      permissionCodeMap,
      login,
      logout,
      postRefreshToken,
      getProfile,
    };
  },
  {
    persist: {
      paths: [
        "accessToken",
        "refreshToken",
        "tokenType",
        "username",
        "email",
        "mobile",
      ],
    },
  }
);
