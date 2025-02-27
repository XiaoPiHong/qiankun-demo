<template>
  <a-modal
    v-model:open="open"
    :okButtonProps="{ disabled }"
    title="重置客户端密钥"
    @ok="onOkModal"
    @cancel="onCancelModal"
  >
    <a-form ref="formRef" :model="form.data" :disabled="disabled">
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item
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
    type: "";
    data?: any;
  }>(),
  {
    data: {},
  }
);
const open = defineModel<boolean>("open", {
  required: true,
});

const disabled = computed(() => false);
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

      return apisSystemClient.patchClientResetClientSecretById(
        props.data.id,
        data
      );
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
      const { clientSecret } = props.data;

      form.value.data = {
        clientSecret,
      };
    }
  }
);
</script>
