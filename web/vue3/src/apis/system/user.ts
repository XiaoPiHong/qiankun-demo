import request from "@/utils/request";

/**
 * 查询（所有）
 */
export const getUserAll = (query = {}) => {
  return request.get({
    url: "/user/all",
    query,
  });
};

/**
 * 查询（分页）
 */
export const getUserPage = (query = {}) => {
  return request.get({
    url: "/user/page",
    query,
  });
};

/**
 * 查询详情
 */
export const getUserById = (id) => {
  return request.get({
    url: `/user/${id}`,
  });
};

/**
 * 新增
 */
export const postUser = (data) => {
  return request.post({
    url: "/user",
    data,
  });
};

/**
 * 修改
 */
export const patchUserById = (id, data) => {
  return request.patch({
    url: `/user/${id}`,
    data,
  });
};

/**
 * 删除
 */
export const deleteUserById = (id) => {
  return request.delete({
    url: `/user/${id}`,
  });
};

/**
 * 重置密码
 */
export const patchUserResetPasswordById = (id, data) => {
  return request.patch({
    url: `/user/reset-password/${id}`,
    data,
  });
};
