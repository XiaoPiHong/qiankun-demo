import * as utilsType from "@/utils/type";

function _map(
  iterable: Iterable<any>,
  callback: (
    node: any,
    depth: number,
    target: any,
    parentNode: any | null
  ) => any | false,
  options: { children: string },
  thisArg: any,
  depth: number = 0,
  parentNode: any | null = null
) {
  const tree: any = [];

  for (const node of iterable) {
    const newNode = callback.apply(thisArg, [
      node,
      depth,
      iterable,
      parentNode,
    ]);
    if (newNode !== false) {
      tree.push(newNode);
      if (utilsType.isIterable(newNode[options.children])) {
        newNode[options.children] = _map(
          newNode[options.children],
          callback,
          options,
          thisArg,
          depth + 1,
          newNode
        );
      }
    }
  }

  return tree;
}

export function map(
  list: Iterable<any>,
  callback: (
    node: any,
    depth: number,
    target: any,
    parentNode: any | null
  ) => any | false,
  options = {
    children: "children",
  },
  thisArg?: any
) {
  return _map(list, callback, options, thisArg, 0, null);
}
