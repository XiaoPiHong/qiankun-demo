<template>
  <a-modal
    v-model:open="open"
    :okButtonProps="{ disabled }"
    title="权限组"
    @ok="onOkModal"
    @cancel="onCancelModal"
  >
    <a-form ref="formRef" :model="form.data" :disabled="disabled">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            name="name"
            label="权限组名称"
            :rules="[
              { required: true, message: '请输入权限组名称', trigger: 'blur' },
            ]"
          >
            <a-input
              v-model:value="form.data.name"
              placeholder="请输入权限组名称"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            name="code"
            label="权限组编码"
            :rules="[
              { required: true, message: '请输入权限组编码', trigger: 'blur' },
            ]"
          >
            <a-input
              v-model:value="form.data.code"
              placeholder="请输入权限组编码"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item name="permissionIds" label="权限列表">
            <a-tree-select
              v-model:value="form.data.permissionIds"
              :tree-data="form.options.permissionIds"
              :show-checked-strategy="TreeSelect.SHOW_ALL"
              tree-node-filter-prop="label"
              placeholder="请选择权限列表"
              show-search
              allow-clear
              tree-checkable
              tree-default-expand-all
              tree-check-strictly
            >
              <template #title="item">
                <a-tag v-if="item.type === 'MENU'" color="blue">菜单</a-tag>
                <a-tag v-else-if="item.type === 'BUTTON'" color="green">
                  按钮
                </a-tag>
                <a-tag v-else-if="item.type === 'INTERFACE'" color="yellow">
                  接口
                </a-tag>
                <span class="ml-r">{{ item.name }}</span>
              </template>
            </a-tree-select>
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
import * as apisSecurityPermissionGroup from "@/apis/security/permission-group";
import * as apisSecurityPermission from "@/apis/security/permission";
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

const disabled = computed(() => props.type === "view");
const formRef = ref();
const form = ref<any>({
  data: {},
  options: {
    permissionIds: [],
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

      data.permissionIds = data.permissionIds.map((item) => item.value);

      if (props.type === "add") {
        return apisSecurityPermissionGroup.postPermissionGroup(data);
      } else if (props.type === "edit") {
        return apisSecurityPermissionGroup.patchPermissionGroupById(
          props.data.id,
          data
        );
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
 * 获取选项（权限标识列表）
 */
const getOptionsPermissionIds = () => {
  return apisSecurityPermission.getPermissionTree().then((res) => {
    const { id } = props.data;

    form.value.options.permissionIds = utilsTree.map(
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
        ...props.data,
        permissionIds: props.data.permissionIds?.map((item) => ({
          value: item,
        })),
      };
      getOptionsPermissionIds();
    }
  }
);
</script>
