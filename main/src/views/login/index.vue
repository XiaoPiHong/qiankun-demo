<template>
  <div
    class="w-screen h-screen flex justify-center items-center overflow-hidden"
  >
    <div class="w-[400px] p-8 shadow-xl">
      <h2 class="text-3xl text-center">登录</h2>

      <a-tabs class="mt-4" v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="账号密码">
          <UsernameLoginForm />
        </a-tab-pane>
        <a-tab-pane key="2" tab="邮箱验证码">
          <EmailLoginForm />
        </a-tab-pane>
        <a-tab-pane key="3" tab="手机验证码" disabled>
          <MobileLoginForm />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import UsernameLoginForm from "./components/username-login-form.vue";
import EmailLoginForm from "./components/email-login-form.vue";
import MobileLoginForm from "./components/mobile-login-form.vue";

const activeKey = ref("1");
</script>
