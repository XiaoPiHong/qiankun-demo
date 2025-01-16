<template>
  <a-modal
    v-model:open="open"
    :okButtonProps="{ disabled }"
    title="权限"
    @ok="onOkModal"
    @cancel="onCancelModal"
  >
    <a-form ref="formRef" :model="form.data" :disabled="disabled">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            name="name"
            label="权限名称"
            :rules="[
              { required: true, message: '请输入权限名称', trigger: 'blur' },
            ]"
          >
            <a-input
              v-model:value="form.data.name"
              placeholder="请输入权限名称"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="parentId" label="上级权限">
            <a-tree-select
              v-model:value="form.data.parentId"
              :tree-data="form.options.parentId"
              tree-node-filter-prop="label"
              placeholder="请选择上级权限"
              show-search
              allow-clear
              tree-default-expand-all
            >
            </a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            name="code"
            label="权限编码"
            :rules="[
              { required: true, message: '请输入权限编码', trigger: 'blur' },
            ]"
          >
            <a-input
              v-model:value="form.data.code"
              placeholder="请输入权限编码"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            name="type"
            label="权限类型"
            :rules="[
              { required: true, message: '请选择权限类型', trigger: 'change' },
            ]"
          >
            <a-radio-group
              v-model:value="form.data.type"
              placeholder="请选择权限类型"
            >
              <a-radio value="MENU">菜单</a-radio>
              <a-radio value="BUTTON">按钮</a-radio>
              <a-radio value="INTERFACE">接口</a-radio>
            </a-radio-group>
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
import * as apisSecurityPermission from "@/apis/security/permission";
import * as utilsTree from "@/utils/tree";
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
  options: {
    parentId: [],
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

      if (props.type === "add") {
        return apisSecurityPermission.postPermission(data);
      } else if (props.type === "edit") {
        return apisSecurityPermission.patchPermissionById(props.data.id, data);
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
 * 获取选项（上级标识）
 */
const getOptionsParentId = () => {
  return apisSecurityPermission.getPermissionTree().then((res) => {
    const { id } = props.data;

    form.value.options.parentId = utilsTree.map(
      res.data,
      (node, depth, target, parentNode) => {
        return {
          ...node,
          label: node.name,
          value: node.id,
          disabled:
            node.id === id ||
            node.parentId === id ||
            (parentNode && parentNode.disabled),
        };
      }
    );
  });
};

watch(
  () => open.value,
  (value) => {
    if (value) {
      form.value.data = { type: "MENU", ...props.data };
      getOptionsParentId();
    }
  }
);
</script>
