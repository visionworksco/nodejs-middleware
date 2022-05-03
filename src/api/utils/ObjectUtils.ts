const isEmpty = (obj: Object): boolean => {
  return JSON.stringify(obj) === JSON.stringify({});
};

const destruct = <T, K extends keyof T>(obj: T, keys: K[]): T =>
  keys.reduce((a, c) => ({ ...a, [c]: obj[c] }), {} as T);

export const ObjectUtils = {
  isEmpty,
  destruct,
};
