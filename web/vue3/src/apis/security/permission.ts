import request from "@/utils/request";

/**
 * 查询（所有）
 */
export const getPermissionAll = (query = {}) => {
  return request.get({
    url: "/permission/all",
    query,
  });
};

/**
 * 查询（分页）
 */
export const getPermissionPage = (query = {}) => {
  return request.get({
    url: "/permission/page",
    query,
  });
};

/**
 * 查询（树）
 */
export const getPermissionTree = (query = {}) => {
  return request.get({
    url: "/permission/tree",
    query,
  });
};

/**
 * 查询（懒树）
 */
export const getPermissionTreeLazy = (query = {}) => {
  return request.get({
    url: "/permission/tree-lazy",
    query,
  });
};

/**
 * 查询详情
 */
export const getPermissionById = (id) => {
  return request.get({
    url: `/permission/${id}`,
  });
};

/**
 * 新增
 */
export const postPermission = (data) => {
  return request.post({
    url: "/permission",
    data,
  });
};

/**
 * 修改
 */
export const patchPermissionById = (id, data) => {
  return request.patch({
    url: `/permission/${id}`,
    data,
  });
};

/**
 * 删除
 */
export const deletePermissionById = (id) => {
  return request.delete({
    url: `/permission/${id}`,
  });
};
