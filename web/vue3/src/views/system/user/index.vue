<template>
  <div>
    <!-- 搜索栏 -->
    <a-form ref="searchRef" :model="search.data" @finish="onFinishSearch">
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item name="username" label="账号">
            <a-input
              v-model:value="search.data.username"
              placeholder="请输入账号"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item name="email" label="电子邮箱">
            <a-input
              v-model:value="search.data.email"
              placeholder="请输入电子邮箱"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item name="mobile" label="手机号码">
            <a-input
              v-model:value="search.data.mobile"
              placeholder="请输入手机号码"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item name="name" label="姓名">
            <a-input
              v-model:value="search.data.name"
              placeholder="请输入姓名"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item name="sex" label="性别">
            <a-radio-group
              v-model:value="search.data.sex"
              placeholder="请选择性别"
            >
              <a-radio value="MALE">男</a-radio>
              <a-radio value="FEMALE">女</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item name="enabled" label="是否启用">
            <a-radio-group
              v-model:value="search.data.enabled"
              placeholder="请选择是否启用"
            >
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>

        <!-- 折叠 -->
        <template v-if="search.expand">
          <a-col :span="8">
            <a-form-item name="birthday" label="生日">
              <a-date-picker
                class="w-full"
                v-model:value="search.data.birthday"
                valueFormat="YYYY-MM-DD"
                placeholder="请选择生日"
              />
            </a-form-item>
          </a-col>
        </template>
      </a-row>
      <a-row>
        <a-col :span="24" style="text-align: right">
          <a-button type="primary" html-type="submit">搜索</a-button>
          <a-button
            style="margin: 0 8px"
            @click="() => searchRef.resetFields()"
          >
            重置
          </a-button>
          <a style="font-size: 12px" @click="search.expand = !search.expand">
            <template v-if="search.expand">
              <UpOutlined />
              收起
            </template>
            <template v-else>
              <DownOutlined />
              展开
            </template>
          </a>
        </a-col>
      </a-row>
    </a-form>

    <!-- 工具栏 -->
    <div class="h-10 leading-10">
      <a-button
        v-if="userStore.permissionCodeMap['system:user:add']"
        type="primary"
        @click="onClickAddBtn"
      >
        新增
      </a-button>
    </div>

    <!-- 表格 -->
    <a-table
      :loading="table.loading"
      :columns="table.columns"
      :data-source="table.data"
      :pagination="table.pagination"
      :scroll="{ x: 'max-content', y: 1000 }"
      @change="onChangeTable"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'sex'">
          <span v-if="record.sex === 'MALE'">男</span>
          <span v-else-if="record.sex === 'FEMALE'">女</span>
        </template>
        <template v-if="column.dataIndex === 'enabled'">
          <a-switch
            v-model:checked="record.enabled"
            :loading="record.loadingEnabled"
            @change="onChangeEnabled(record)"
          ></a-switch>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <div class="space-x-4">
            <a
              v-if="userStore.permissionCodeMap['system:user:view']"
              @click="onClickViewLink(record)"
            >
              查看
            </a>
            <a
              v-if="userStore.permissionCodeMap['system:user:edit']"
              @click="onClickEditLink(record)"
            >
              编辑
            </a>
            <a-popconfirm
              v-if="userStore.permissionCodeMap['system:user:delete']"
              title="确认删除吗？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="onConfirmDeleteRow(record)"
            >
              <a>删除</a>
            </a-popconfirm>
            <a
              v-if="userStore.permissionCodeMap['system:user:reset-password']"
              @click="onClickResetPasswordLink(record)"
            >
              重置密码
            </a>
          </div>
        </template>
      </template>
    </a-table>

    <crud-modal
      v-model:open="crudModal.open"
      :type="crudModal.type"
      :data="crudModal.data"
      @ok="onOkCrudModal"
    />

    <reset-password-modal
      v-model:open="resetPasswordModal.open"
      :type="resetPasswordModal.type"
      :data="resetPasswordModal.data"
      @ok="onOkResetPasswordModal"
    />
  </div>
</template>

<script lang="ts" setup>
import * as apisSystemUser from "@/apis/system/user";
import { message } from "ant-design-vue";
import { UpOutlined, DownOutlined } from "@ant-design/icons-vue";
import { useUserStore } from "@/stores";
import CrudModal from "./compoments/crud-modal.vue";
import ResetPasswordModal from "./compoments/reset-password-modal.vue";

const userStore = useUserStore();
const instance = getCurrentInstance()!;
const { $dayjs } = instance.appContext.config.globalProperties;
const { VITE_TIME_ZONE } = import.meta.env;
const searchRef = ref();
const search = ref<any>({
  expand: false,
  data: {},
});

const table = ref({
  loading: false,
  columns: [
    { title: "账号", dataIndex: "username", width: 160 },
    { title: "电子邮箱", dataIndex: "email", width: 160 },
    { title: "手机号码", dataIndex: "mobile", width: 160 },
    { title: "姓名", dataIndex: "name", width: 160 },
    { title: "性别", dataIndex: "sex", width: 80 },
    { title: "是否启用", dataIndex: "enabled", width: 160 },
    { title: "生日", dataIndex: "birthday", width: 160 },
    { title: "创建时间", dataIndex: "createdAt", width: 160 },
    { title: "更新时间", dataIndex: "updatedAt", width: 160 },
    { title: "操作", dataIndex: "operation", width: 240, fixed: "right" },
  ],
  data: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    showLessItems: true,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`,
  },
});

const crudModal = ref<any>({
  open: false,
  type: "add",
  data: {},
});

const resetPasswordModal = ref<any>({
  open: false,
  type: "",
  data: {},
});

/**
 * 获取表格数据
 */
const getTableData = () => {
  const query = search.value.data;
  table.value.loading = true;
  return apisSystemUser
    .getUserPage({
      ...query,
      ...table.value.pagination,
      birthday: query.birthday
        ? $dayjs(query.birthday, { utc: true })
            .tz(VITE_TIME_ZONE)
            .format("YYYY-MM-DD HH:mm:ss")
        : undefined,
    })
    .then((res) => {
      const { list, current, pageSize, total } = res.data;
      table.value.data = list.map((item) => ({
        ...item,
        key: item.id,
        loadingEnabled: false,
        birthday: $dayjs(item.birthday, { utc: true })
          .tz(VITE_TIME_ZONE)
          .format("YYYY-MM-DD"),
        createdAt: $dayjs(item.createdAt, { utc: true })
          .tz(VITE_TIME_ZONE)
          .format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: $dayjs(item.updatedAt, { utc: true })
          .tz(VITE_TIME_ZONE)
          .format("YYYY-MM-DD HH:mm:ss"),
      }));
      table.value.pagination.current = current;
      table.value.pagination.pageSize = pageSize;
      table.value.pagination.total = total;
    })
    .finally(() => {
      table.value.loading = false;
    });
};

/**
 * 事件监听，finish on Search
 */
const onFinishSearch = () => {
  return getTableData();
};

/**
 * 事件监听，change on Table
 */
const onChangeTable = (pagination, filters, sorter) => {
  table.value.pagination.current = pagination.current;
  table.value.pagination.pageSize = pagination.pageSize;
  return getTableData();
};

/**
 * 事件监听，change on 是否启用
 * @param row 行数据
 */
const onChangeEnabled = (row) => {
  const { id, enabled } = row;

  row.loadingEnabled = true;
  apisSystemUser
    .patchUserById(id, { enabled })
    .then((res) => {
      message.success(res.message);
      return getTableData();
    })
    .finally(() => {
      row.loadingEnabled = false;
    });
};

/**
 * 事件监听，click on 新增按钮
 */
const onClickAddBtn = () => {
  crudModal.value = {
    open: true,
    type: "add",
    data: {},
  };
};

/**
 * 事件监听，click on 查看链接
 * @param row 行数据
 */
const onClickViewLink = (row) => {
  apisSystemUser.getUserById(row.id).then((res) => {
    crudModal.value = {
      open: true,
      type: "view",
      data: res.data,
    };
  });
};

/**
 * 事件监听，click on 编辑链接
 * @param row 行数据
 */
const onClickEditLink = (row) => {
  apisSystemUser.getUserById(row.id).then((res) => {
    crudModal.value = {
      open: true,
      type: "edit",
      data: res.data,
    };
  });
};

/**
 * 事件监听，confirm on 删除行
 * @param row 行数据
 */
const onConfirmDeleteRow = (row) => {
  apisSystemUser.deleteUserById(row.id).then((res) => {
    return getTableData();
  });
};

/**
 * 事件监听，click on 重置密码链接
 * @param row 行数据
 */
const onClickResetPasswordLink = (row) => {
  resetPasswordModal.value = {
    open: true,
    type: "",
    data: row,
  };
};

/**
 * 事件监听，ok on CrudModal
 */
const onOkCrudModal = () => {
  return getTableData();
};

/**
 * 事件监听，ok on ResetPasswordModal
 */
const onOkResetPasswordModal = () => {
  return getTableData();
};

onBeforeMount(() => {
  getTableData();
});
</script>
