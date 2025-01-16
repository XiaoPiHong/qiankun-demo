import request from "@/utils/request";

/**
 * 查询（所有）
 */
export const getPermissionGroupAll = (query = {}) => {
  return request.get({
    url: "/permission-group/all",
    query,
  });
};

/**
 * 查询（分页）
 */
export const getPermissionGroupPage = (query = {}) => {
  return request.get({
    url: "/permission-group/page",
    query,
  });
};

/**
 * 查询详情
 */
export const getPermissionGroupById = (id) => {
  return request.get({
    url: `/permission-group/${id}`,
  });
};

/**
 * 新增
 */
export const postPermissionGroup = (data) => {
  return request.post({
    url: "/permission-group",
    data,
  });
};

/**
 * 修改
 */
export const patchPermissionGroupById = (id, data) => {
  return request.patch({
    url: `/permission-group/${id}`,
    data,
  });
};

/**
 * 删除
 */
export const deletePermissionGroupById = (id) => {
  return request.delete({
    url: `/permission-group/${id}`,
  });
};
