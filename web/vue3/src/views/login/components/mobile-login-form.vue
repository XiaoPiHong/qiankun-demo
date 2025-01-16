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
      label="手机号码"
      name="mobile"
      :rules="[{ required: true, message: '请输入手机号码', trigger: 'blur' }]"
    >
      <a-input v-model:value="formState.mobile" placeholder="请输入手机号码" />
    </a-form-item>

    <a-form-item
      label="验证码"
      name="mobileCode"
      :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]"
    >
      <a-input
        v-model:value="formState.mobileCode"
        placeholder="请输入验证码"
      />
    </a-form-item>

    <a-form-item name="remember" :wrapper-col="{ offset: 6, span: 18 }">
      <a-checkbox v-model:checked="formState.remember"> 记住账号 </a-checkbox>
    </a-form-item>

    <a-form-item class="mb-4" :wrapper-col="{ span: 24 }">
      <a-button class="w-full" type="primary" html-type="submit">登录</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores";
import { useCountdown } from "../compositions";

const router = useRouter();
const userStore = useUserStore();
const formRef = ref<any>();
const formState = reactive({
  mobile: userStore.mobile,
  mobileCode: "",
  remember: true,
});

const onFinish = (values: any) => {
  console.log("Success:", values);
};
</script>
