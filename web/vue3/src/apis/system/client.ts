import request from "@/utils/request";

/**
 * 查询（所有）
 */
export const getClientAll = (query = {}) => {
  return request.get({
    url: "/client/all",
    query,
  });
};

/**
 * 查询（分页）
 */
export const getClientPage = (query = {}) => {
  return request.get({
    url: "/client/page",
    query,
  });
};

/**
 * 查询详情
 */
export const getClientById = (id) => {
  return request.get({
    url: `/client/${id}`,
  });
};

/**
 * 新增
 */
export const postClient = (data) => {
  return request.post({
    url: "/client",
    data,
  });
};

/**
 * 修改
 */
export const patchClientById = (id, data) => {
  return request.patch({
    url: `/client/${id}`,
    data,
  });
};

/**
 * 删除
 */
export const deleteClientById = (id) => {
  return request.delete({
    url: `/client/${id}`,
  });
};

/**
 * 重置客户端密钥
 */
export const patchClientResetClientSecretById = (id, data) => {
  return request.patch({
    url: `/client/reset-client-secret/${id}`,
    data,
  });
};
