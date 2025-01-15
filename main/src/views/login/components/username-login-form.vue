<template>
  <a-form
    ref="formRef"
    autocomplete="off"
    :model="formState"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 18 }"
    @finish="onFinish"
  >
    <a-form-item
      label="账号"
      name="username"
      :rules="[{ required: true, message: '请输入账号', trigger: 'blur' }]"
    >
      <a-input v-model:value="formState.username" placeholder="请输入账号" />
    </a-form-item>

    <a-form-item
      label="密码"
      name="password"
      :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
    >
      <a-input-password
        v-model:value="formState.password"
        placeholder="请输入密码"
      />
    </a-form-item>

    <a-form-item name="remember" :wrapper-col="{ offset: 6, span: 18 }">
      <a-checkbox v-model:checked="formState.remember">记住账号</a-checkbox>
    </a-form-item>

    <a-form-item class="mb-4" :wrapper-col="{ span: 24 }">
      <a-button class="w-full" type="primary" html-type="submit">登录</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import * as apisAuth from "@/apis/auth";
import CryptoJS from "crypto-js";
import cryptoRandomString from "crypto-random-string";
import { useUserStore } from "@/stores";

const { VITE_CLIENT_ID } = import.meta.env;
const router = useRouter();
const userStore = useUserStore();
const formRef = ref<any>();
const formState = reactive({
  username: userStore.username || "read-only1",
  password: "Read-only1",
  remember: true,
});

const onFinish = (values: any) => {
  const { username, password } = formState;
  const timestamp = Date.now().toString();
  const nonceStr = cryptoRandomString({ length: 16, type: "alphanumeric" });
  const signature = CryptoJS.MD5(
    `${nonceStr}${timestamp}${CryptoJS.MD5(password)}`
  ).toString();

  apisAuth
    .postAuthSignInByUsername({
      username,
      nonceStr,
      timestamp,
      signature,
      clientId: VITE_CLIENT_ID,
    })
    .then((res) => {
      userStore.login(res.data);
      userStore.username = formState.remember ? formState.username : "";
      router.push("/");
    });
};
</script>
