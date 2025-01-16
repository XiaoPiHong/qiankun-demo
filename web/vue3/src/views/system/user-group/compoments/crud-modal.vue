<template>
  <a-modal
    v-model:open="open"
    :okButtonProps="{ disabled }"
    title="用户组"
    @ok="onOkModal"
    @cancel="onCancelModal"
  >
    <a-form ref="formRef" :model="form.data" :disabled="disabled">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            name="name"
            label="用户组名称"
            :rules="[
              { required: true, message: '请输入用户组名称', trigger: 'blur' },
            ]"
          >
            <a-input
              v-model:value="form.data.name"
              placeholder="请输入用户组名称"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="parentId" label="上级用户组">
            <a-tree-select
              v-model:value="form.data.parentId"
              :tree-data="form.options.parentId"
              tree-node-filter-prop="label"
              placeholder="请选择上级用户组"
              show-search
              allow-clear
              tree-default-expand-all
            >
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
import * as apisSystemUserGroup from "@/apis/system/user-group";
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
        return apisSystemUserGroup.postUserGroup(data);
      } else if (props.type === "edit") {
        return apisSystemUserGroup.patchUserGroupById(props.data.id, data);
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
  return apisSystemUserGroup.getUserGroupTree().then((res) => {
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
      form.value.data = {
        ...props.data,
      };
      getOptionsParentId();
    }
  }
);
</script>
