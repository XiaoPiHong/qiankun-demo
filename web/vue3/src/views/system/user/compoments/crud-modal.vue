<template>
  <a-modal
    v-model:open="open"
    :okButtonProps="{ disabled }"
    title="用户"
    @ok="onOkModal"
    @cancel="onCancelModal"
  >
    <a-form ref="formRef" :model="form.data" :disabled="disabled">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            name="username"
            label="账号"
            :rules="[
              { required: true, message: '请输入账号', trigger: 'blur' },
            ]"
          >
            <a-input
              v-model:value="form.data.username"
              placeholder="请输入账号"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            v-if="type === 'add'"
            name="password"
            label="密码"
            :rules="[
              { required: true, message: '请输入密码', trigger: 'blur' },
            ]"
          >
            <a-input-password
              v-model:value="form.data.password"
              type="password"
              placeholder="请输入密码"
            ></a-input-password>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            name="email"
            label="电子邮箱"
            :rules="[
              { required: true, message: '请输入电子邮箱', trigger: 'blur' },
            ]"
          >
            <a-input
              v-model:value="form.data.email"
              placeholder="请输入电子邮箱"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            name="mobile"
            label="手机号码"
            :rules="[
              { required: true, message: '请输入手机号码', trigger: 'blur' },
            ]"
          >
            <a-input
              v-model:value="form.data.mobile"
              placeholder="请输入手机号码"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            name="name"
            label="姓名"
            :rules="[
              { required: true, message: '请输入姓名', trigger: 'blur' },
            ]"
          >
            <a-input
              v-model:value="form.data.name"
              placeholder="请输入姓名"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            name="sex"
            label="性别"
            :rules="[
              { required: true, message: '请选择性别', trigger: 'change' },
            ]"
          >
            <a-radio-group
              v-model:value="form.data.sex"
              placeholder="请选择性别"
            >
              <a-radio value="MALE">男</a-radio>
              <a-radio value="FEMALE">女</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            name="enabled"
            label="是否启用"
            :rules="[
              { required: true, message: '请选择是否启用', trigger: 'change' },
            ]"
          >
            <a-radio-group
              v-model:value="form.data.enabled"
              placeholder="请选择是否启用"
            >
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="birthday" label="生日">
            <a-date-picker
              class="w-full"
              v-model:value="form.data.birthday"
              valueFormat="YYYY-MM-DD"
              placeholder="请选择生日"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item name="permissionGroupIds" label="权限组列表">
            <a-select
              v-model:value="form.data.permissionGroupIds"
              mode="multiple"
              placeholder="请选择权限组列表"
              show-search
              allow-clear
            >
              <a-select-option
                v-for="item of form.options.permissionGroupIds"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item name="userGroupIds" label="用户组列表">
            <a-tree-select
              v-model:value="form.data.userGroupIds"
              :tree-data="form.options.userGroupIds"
              :show-checked-strategy="TreeSelect.SHOW_ALL"
              tree-node-filter-prop="label"
              placeholder="请选择用户组列表"
              show-search
              allow-clear
              tree-checkable
              tree-default-expand-all
              tree-check-strictly
            >
            </a-tree-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import * as apisSystemUser from "@/apis/system/user";
import * as apisSystemUserGroup from "@/apis/system/user-group";
import * as apisSecurityPermissionGroup from "@/apis/security/permission-group";
import * as utilsTree from "@/utils/tree";
import { message } from "ant-design-vue";
import { TreeSelect } from "ant-design-vue";

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

const instance = getCurrentInstance()!;
const { $dayjs } = instance.appContext.config.globalProperties;
const { VITE_TIME_ZONE } = import.meta.env;

const disabled = computed(() => props.type === "view");
const formRef = ref();
const form = ref<any>({
  data: {},
  options: {
    permissionGroupIds: [],
    userGroupIds: [],
  },
});

/**
 * 事件监听，ok on 对话框
 */
const onOkModal = () => {
  formRef.value
    .validate()
    .then(() => {
      const data = { ...form.value.data };

      if (data.birthday) {
        data.birthday = $dayjs(data.birthday, { utc: true })
          .tz(VITE_TIME_ZONE)
          .format("YYYY-MM-DD HH:mm:ss");
      }

      data.userGroupIds = data.userGroupIds.map((item) => item.value);

      if (props.type === "add") {
        return apisSystemUser.postUser(data);
      } else if (props.type === "edit") {
        return apisSystemUser.patchUserById(props.data.id, data);
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

/**
 * 获取选项（权限组标识列表）
 */
const getOptionsPermissionGroupIds = () => {
  return apisSecurityPermissionGroup.getPermissionGroupAll().then((res) => {
    form.value.options.permissionGroupIds = res.data.map((item) => ({
      ...item,
      label: item.name,
      value: item.id,
    }));
  });
};

/**
 * 获取选项（用户组标识列表）
 */
const getOptionsUserGroupIds = () => {
  return apisSystemUserGroup.getUserGroupTree().then((res) => {
    const { id } = props.data;

    form.value.options.userGroupIds = utilsTree.map(
      res.data,
      (node, depth, target, parentNode) => {
        return {
          ...node,
          label: node.name,
          value: node.id,
        };
      }
    );
  });
};

watch(
  () => open.value,
  (value) => {
    if (value) {
      form.value.data = {
        sex: "MALE",
        enabled: true,
        ...props.data,
        userGroupIds: props.data.userGroupIds?.map((item) => ({ value: item })),
      };
      getOptionsPermissionGroupIds();
      getOptionsUserGroupIds();
    }
  }
);
</script>
