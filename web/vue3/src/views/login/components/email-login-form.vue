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
      label="邮箱"
      name="email"
      :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' }]"
    >
      <a-input v-model:value="formState.email" placeholder="请输入邮箱" />
    </a-form-item>

    <a-form-item
      label="验证码"
      name="emailCode"
      :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]"
    >
      <div class="flex">
        <a-input
          v-model:value="formState.emailCode"
          placeholder="请输入验证码"
        />
        <a-button
          class="ml-2"
          type="primary"
          :disabled="btnDisabled || activeCountdown"
          @click="clickSendEmailCodeBtn"
        >
          {{ activeCountdown ? `${countCountdown}s 后可重发` : "发送验证码" }}
        </a-button>
      </div>
    </a-form-item>

    <a-form-item name="remember" :wrapper-col="{ offset: 6, span: 18 }">
      <a-checkbox v-model:checked="formState.remember">记住账号</a-checkbox>
    </a-form-item>

    <a-form-item class="mb-4" :wrapper-col="{ span: 24 }">
      <a-button
        class="w-full"
        type="primary"
        :disabled="btnDisabled"
        html-type="submit"
      >
        登录
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import * as apisAuth from "@/apis/auth";
import { useUserStore } from "@/stores";
import { useCountdown } from "../compositions";

const { VITE_CLIENT_ID } = import.meta.env;
const router = useRouter();
const userStore = useUserStore();
const formRef = ref<any>();
const formState = reactive({
  email: userStore.email,
  emailCode: "",
  remember: true,
});
const {
  count: countCountdown,
  active: activeCountdown,
  restart: restartCountdown,
} = useCountdown();

const btnDisabled = ref(false);

const onFinish = (values: any) => {
  const { email, emailCode } = formState;

  apisAuth
    .postAuthSignInByEmail({ email, emailCode, client_id: VITE_CLIENT_ID })
    .then((res) => {
      userStore.login(res.data);
      userStore.email = formState.remember ? formState.email : "";
      router.push("/");
    });
};

const clickSendEmailCodeBtn = () => {
  btnDisabled.value = true;
  formRef.value
    .validateFields(["email"])
    .then(() => {
      return apisAuth.postAuthSendEmailForSignIn({ email: formState.email });
    })
    .then((res) => {
      restartCountdown(res.data.expire);
    })
    .finally(() => {
      btnDisabled.value = false;
    });
};
</script>
