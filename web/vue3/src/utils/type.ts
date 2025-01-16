/**
 * 判断目标是否为对象
 * @param target 目标对象
 */
export const isObject = (target: any) => {
    return typeof target === "object" && target !== null;
  };
  
  /**
   * 判断目标是否为可迭代对象
   * @param target 目标对象
   */
  export const isIterable = (target: any) => {
    return isObject(target) && typeof target[Symbol.iterator] === "function";
  };
  
  /**
   * 判断目标是否为 null
   * @param target 目标对象
   */
  export const isNull = (target: any) => {
    return target === null;
  };
  
  /**
   * 判断目标是否为整数
   * @param target 目标对象
   */
  export const isInteger = (target: any) => {
    return typeof target === "number" && Number.isInteger(target);
  };
  
  /**
   * 判断目标是否包含某个键
   * @param target 目标对象
   * @param key 键
   * @returns
   */
  export const hasOwn = (target: any, key: string) => {
    return Object.prototype.hasOwnProperty.call(target, key);
  };
  