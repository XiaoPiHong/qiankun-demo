import request from "@/utils/request";

/**
 * 查询（所有）
 */
export const getUserGroupAll = (query = {}) => {
  return request.get({
    url: "/user-group/all",
    query,
  });
};

/**
 * 查询（分页）
 */
export const getUserGroupPage = (query = {}) => {
  return request.get({
    url: "/user-group/page",
    query,
  });
};

/**
 * 查询（树）
 */
export const getUserGroupTree = (query = {}) => {
  return request.get({
    url: "/user-group/tree",
    query,
  });
};

/**
 * 查询（懒树）
 */
export const getUserGroupTreeLazy = (query = {}) => {
  return request.get({
    url: "/user-group/tree-lazy",
    query,
  });
};

/**
 * 查询详情
 */
export const getUserGroupById = (id) => {
  return request.get({
    url: `/user-group/${id}`,
  });
};

/**
 * 新增
 */
export const postUserGroup = (data) => {
  return request.post({
    url: "/user-group",
    data,
  });
};

/**
 * 修改
 */
export const patchUserGroupById = (id, data) => {
  return request.patch({
    url: `/user-group/${id}`,
    data,
  });
};

/**
 * 删除
 */
export const deleteUserGroupById = (id) => {
  return request.delete({
    url: `/user-group/${id}`,
  });
};
