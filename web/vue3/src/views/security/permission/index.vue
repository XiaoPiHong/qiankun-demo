<template>
  <div>
    <!-- 搜索栏 -->
    <a-form ref="searchRef" :model="search.data" @finish="onFinishSearch">
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item name="name" label="权限名称">
            <a-input
              v-model:value="search.data.name"
              placeholder="请输入权限名称"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item name="code" label="权限编码">
            <a-input
              v-model:value="search.data.code"
              placeholder="请输入权限编码"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item name="type" label="权限类型">
            <a-radio-group
              v-model:value="search.data.type"
              placeholder="请选择权限类型"
            >
              <a-radio value="MENU">菜单</a-radio>
              <a-radio value="BUTTON">按钮</a-radio>
              <a-radio value="INTERFACE">接口</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item name="description" label="描述">
            <a-input
              v-model:value="search.data.description"
              placeholder="请输入描述"
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
        v-if="userStore.permissionCodeMap['security:permission:add']"
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
      :pagination="false"
      :scroll="{ x: 'max-content', y: 1000 }"
      @change="onChangeTable"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'type'">
          <a-tag v-if="record.type === 'MENU'" color="blue">菜单</a-tag>
          <a-tag v-else-if="record.type === 'BUTTON'" color="green">按钮</a-tag>
          <a-tag v-else-if="record.type === 'INTERFACE'" color="yellow">
            接口
          </a-tag>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <div class="space-x-4">
            <a
              v-if="userStore.permissionCodeMap['security:permission:view']"
              @click="onClickViewLink(record)"
            >
              查看
            </a>
            <a
              v-if="userStore.permissionCodeMap['security:permission:edit']"
              @click="onClickEditLink(record)"
            >
              编辑
            </a>
            <a-popconfirm
              v-if="userStore.permissionCodeMap['security:permission:delete']"
              title="确认删除吗？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="onConfirmDeleteRow(record)"
            >
              <a>删除</a>
            </a-popconfirm>
            <a
              v-if="
                userStore.permissionCodeMap['security:permission:add-child']
              "
              @click="onClickAddChildLink(record)"
            >
              新增子项
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
  </div>
</template>

<script lang="ts" setup>
import * as apisSecurityPermission from "@/apis/security/permission";
import * as utilsTree from "@/utils/tree";
import { message } from "ant-design-vue";
import { UpOutlined, DownOutlined } from "@ant-design/icons-vue";
import CrudModal from "./compoments/crud-modal.vue";
import { useUserStore } from "@/stores";

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
    { title: "权限名称", dataIndex: "name", width: 160 },
    { title: "权限编码", dataIndex: "code", width: 160 },
    { title: "权限类型", dataIndex: "type", width: 160 },
    { title: "描述", dataIndex: "description", width: 160 },
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

/**
 * 获取表格数据
 */
const getTableData = () => {
  const query = search.value.data;
  table.value.loading = true;
  return apisSecurityPermission
    .getPermissionTree({
      ...query,
    })
    .then((res) => {
      const list = res.data;
      table.value.data = utilsTree.map(list, (item) => ({
        ...item,
        key: item.id,
        createdAt: $dayjs(item.createdAt, { utc: true })
          .tz(VITE_TIME_ZONE)
          .format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: $dayjs(item.updatedAt, { utc: true })
          .tz(VITE_TIME_ZONE)
          .format("YYYY-MM-DD HH:mm:ss"),
      }));
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
  apisSecurityPermission.getPermissionById(row.id).then((res) => {
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
  apisSecurityPermission.getPermissionById(row.id).then((res) => {
    crudModal.value = {
      open: true,
      type: "edit",
      data: res.data,
    };
  });
};

/**
 * 事件监听，click on 新增子项链接
 * @param row 行数据
 */
const onClickAddChildLink = (row) => {
  crudModal.value = {
    open: true,
    type: "add",
    data: {
      parentId: row.id,
    },
  };
};

/**
 * 事件监听，confirm on 删除行
 * @param row 行数据
 */
const onConfirmDeleteRow = (row) => {
  apisSecurityPermission.deletePermissionById(row.id).then((res) => {
    return getTableData();
  });
};

/**
 * 事件监听，ok on CrudModal
 */
const onOkCrudModal = () => {
  return getTableData();
};

onBeforeMount(() => {
  getTableData();
});
</script>
