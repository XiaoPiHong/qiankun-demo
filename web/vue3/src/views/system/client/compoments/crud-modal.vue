<template>
  <a-modal
    v-model:open="open"
    :okButtonProps="{ disabled }"
    title="客户端"
    @ok="onOkModal"
    @cancel="onCancelModal"
  >
    <a-form ref="formRef" :model="form.data" :disabled="disabled">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            name="clientId"
            label="客户端标识"
            :rules="[
              { required: true, message: '请输入客户端标识', trigger: 'blur' },
            ]"
          >
            <a-input
              v-model:value="form.data.clientId"
              placeholder="请输入客户端标识"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            v-if="type === 'add'"
            name="clientSecret"
            label="客户端密钥"
            :rules="[
              { required: true, message: '请输入客户端密钥', trigger: 'blur' },
            ]"
          >
            <a-input-password
              v-model:value="form.data.clientSecret"
              placeholder="请输入客户端密钥"
            ></a-input-password>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            name="redirectUris"
            label="允许重定向 URL 列表"
            :rules="[
              {
                required: true,
                message: '请输入允许重定向 URL 列表',
                trigger: 'blur',
              },
            ]"
          >
            <a-select
              v-model:value="form.data.redirectUris"
              mode="tags"
              placeholder="请输入允许重定向 URL 列表"
              show-search
              allow-clear
            >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            name="grants"
            label="允许授权类型列表"
            :rules="[
              {
                required: true,
                message: '请选择允许授权类型列表',
                trigger: 'change',
              },
            ]"
          >
            <a-select
              v-model:value="form.data.grants"
              mode="multiple"
              placeholder="请选择允许授权类型列表"
              show-search
              allow-clear
            >
              <a-select-option value="authorization_code">
                授权码
              </a-select-option>
              <a-select-option value="password">账号密码</a-select-option>
              <a-select-option value="refresh_token">
                刷新令牌
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item name="accessTokenLifetime" label="访问令牌有效期（秒）">
            <a-input-number
              class="w-full"
              v-model:value="form.data.accessTokenLifetime"
              :min="0"
              :step="60"
              :precision="0"
              placeholder="请输入访问令牌有效期（秒）"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item name="refreshTokenLifetime" label="刷新令牌有效期（秒）">
            <a-input-number
              class="w-full"
              v-model:value="form.data.refreshTokenLifetime"
              :min="0"
              :step="60"
              :precision="0"
              placeholder="请输入刷新令牌有效期（秒）"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item name="description" label="描述">
            <a-textarea
              v-model:value="form.data.description"
              :rows="4"
              placeholder="请输入描述"
            ></a-textarea>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import * as apisSystemClient from "@/apis/system/client";
import { message } from "ant-design-vue";

const emits = defineEmits(["ok", "cancel"]);
const props = withDefaults(
  defineProps<{
    type: "add" | "edit" | "view";
    data?: any;
  }>(),
  {
    data: {},
  }
);
const open = defineModel<boolean>("open", {
  required: true,
});

const disabled = computed(() => props.type === "view");
const formRef = ref();
const form = ref<any>({
  data: {},
  options: {},
});

/**
 * 事件监听，ok on 对话框
 */
const onOkModal = () => {
  formRef.value
    .validate()
    .then(() => {
      const data = { ...form.value.data };
      data.redirectUris = data.redirectUris.join(",");
      data.grants = data.grants.join(",");

      if (props.type === "add") {
        return apisSystemClient.postClient(data);
      } else if (props.type === "edit") {
        return apisSystemClient.patchClientById(props.data.id, data);
      }
    })
    .then((res) => {
      message.success(res.message);
      formRef.value.resetFields();
      open.value = false;
      emits("ok");
    });
};

/**
 * 事件监听，cancel on 对话框
 */
const onCancelModal = () => {
  formRef.value.resetFields();
  emits("cancel");
};

watch(
  () => open.value,
  (value) => {
    if (value) {
      form.value.data = {
        ...props.data,
        redirectUris: props.data.redirectUris
          ? props.data.redirectUris.split(",")
          : [],
        grants: props.data.grants ? props.data.grants.split(",") : [],
      };
    }
  }
);
</script>
