async function findAsync<T>(
  array: T[],
  predicate: (t: T) => Promise<boolean>,
): Promise<T | undefined> {
  for (const t of array) {
    if (await predicate(t)) {
      return t;
    }
  }
  return undefined;
}

const reduceUnique = <T>(objects: T[], key: keyof T): any[] => {
  const accumulatorInit: any[] = [];

  const valuesUpdated: any[] = objects.reduce((accumulator, object) => {
    if (!object[key] || accumulator.includes(object[key])) {
      return accumulator;
    }

    accumulator.push(object[key]);
    return accumulator;
  }, accumulatorInit);

  return valuesUpdated;
};

const toObject = <T extends string>(objects: Array<T>): { [K in T]: K } | undefined => {
  if (objects.length === 0) {
    return undefined;
  }

  return objects.reduce((object, key) => {
    object[key] = key;
    return object;
  }, Object.create(null));
};

export const ArrayUtils = {
  findAsync,
  reduceUnique,
  toObject,
};
