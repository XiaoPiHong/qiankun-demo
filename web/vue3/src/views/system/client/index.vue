<template>
  <div>
    <!-- 搜索栏 -->
    <a-form ref="searchRef" :model="search.data" @finish="onFinishSearch">
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item name="clientId" label="客户端标识">
            <a-input
              v-model:value="search.data.clientId"
              placeholder="请输入客户端标识"
            ></a-input>
          </a-form-item>
        </a-col>
        <!-- 折叠 -->
        <template v-if="search.expand"></template>
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
        v-if="userStore.permissionCodeMap['system:client:add']"
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
        <template v-if="column.dataIndex === 'redirectUriList'">
          <a
            v-for="redirectUri in record.redirectUriList"
            class="block text-blue-500"
            target="_blank"
            :href="redirectUri"
          >
            {{ redirectUri }}
          </a>
        </template>
        <template v-if="column.dataIndex === 'grantList'">
          <a-tag
            v-if="record.grantList.includes('authorization_code')"
            color="blue"
          >
            授权码
          </a-tag>
          <a-tag v-if="record.grantList.includes('password')" color="green">
            账号密码
          </a-tag>
          <a-tag
            v-if="record.grantList.includes('refresh_token')"
            color="yellow"
          >
            刷新令牌
          </a-tag>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <div class="space-x-4">
            <a
              v-if="userStore.permissionCodeMap['system:client:view']"
              @click="onClickViewLink(record)"
            >
              查看
            </a>
            <a
              v-if="userStore.permissionCodeMap['system:client:edit']"
              @click="onClickEditLink(record)"
            >
              编辑
            </a>
            <a-popconfirm
              v-if="userStore.permissionCodeMap['system:client:delete']"
              title="确认删除吗？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="onConfirmDeleteRow(record)"
            >
              <a>删除</a>
            </a-popconfirm>
            <a
              v-if="
                userStore.permissionCodeMap['system:client:reset-client-secret']
              "
              @click="onClickResetClientSecretLink(record)"
            >
              重置客户端密钥
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

    <reset-client-secret-modal
      v-model:open="resetClientSecretModal.open"
      :type="resetClientSecretModal.type"
      :data="resetClientSecretModal.data"
      @ok="onOkResetClientSecretModal"
    />
  </div>
</template>

<script lang="ts" setup>
import * as apisSystemClient from "@/apis/system/client";
import { message } from "ant-design-vue";
import { UpOutlined, DownOutlined } from "@ant-design/icons-vue";
import CrudModal from "./compoments/crud-modal.vue";
import { useUserStore } from "@/stores";
import ResetClientSecretModal from "./compoments/reset-client-secret-modal.vue";

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
    { title: "客户端标识", dataIndex: "clientId", width: 160 },
    { title: "允许重定向 URL 列表", dataIndex: "redirectUriList", width: 80 },
    { title: "允许授权类型列表", dataIndex: "grantList", width: 240 },
    {
      title: "访问令牌有效期（秒）",
      dataIndex: "accessTokenLifetime",
      width: 80,
    },
    {
      title: "刷新令牌有效期（秒）",
      dataIndex: "refreshTokenLifetime",
      width: 80,
    },
    { title: "描述", dataIndex: "description", width: 160 },
    { title: "创建时间", dataIndex: "createdAt", width: 160 },
    { title: "更新时间", dataIndex: "updatedAt", width: 160 },
    { title: "操作", dataIndex: "operation", width: 280, fixed: "right" },
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

const resetClientSecretModal = ref<any>({
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
  return apisSystemClient
    .getClientPage({
      ...query,
      ...table.value.pagination,
    })
    .then((res) => {
      const { list, current, pageSize, total } = res.data;
      table.value.data = list.map((item) => ({
        ...item,
        key: item.id,
        createdAt: $dayjs(item.createdAt, { utc: true })
          .tz(VITE_TIME_ZONE)
          .format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: $dayjs(item.updatedAt, { utc: true })
          .tz(VITE_TIME_ZONE)
          .format("YYYY-MM-DD HH:mm:ss"),
        redirectUriList: item.redirectUris.split(","),
        grantList: item.grants.split(","),
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
  apisSystemClient.getClientById(row.id).then((res) => {
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
  apisSystemClient.getClientById(row.id).then((res) => {
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
  apisSystemClient.deleteClientById(row.id).then((res) => {
    return getTableData();
  });
};

/**
 * 事件监听，click on 重置客户端密钥链接
 * @param row 行数据
 */
const onClickResetClientSecretLink = (row) => {
  resetClientSecretModal.value = {
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
 * 事件监听，ok on ResetClientSecretModal
 */
const onOkResetClientSecretModal = () => {
  return getTableData();
};

onBeforeMount(() => {
  getTableData();
});
</script>
