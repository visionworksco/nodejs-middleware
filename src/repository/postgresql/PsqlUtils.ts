import { PsqlOrderedKeysWithValues } from './PsqlOrderedKeysWithValues';

const SEPARATOR = ', ';
const FIELD_ID = 'id';

const keysReducer: (accumulator: string[], key: string) => string[] = (
  accumulator,
  key,
): string[] => {
  // skip the 'id' key
  if (key === FIELD_ID) {
    return accumulator;
  }

  const accumulatorUpdated = [...accumulator, `"${key}"`];
  return accumulatorUpdated;
};

const getOrderedKeysWithValues = (entity: Object): PsqlOrderedKeysWithValues => {
  const keysReduced = Object.keys(entity).reduce(keysReducer, []);
  const keysInlined = keysReduced.join(SEPARATOR);

  const keysOrdered: string[] = [];
  for (let i = 0; i < keysReduced.length; i++) {
    keysOrdered.push(`$${i + 1}`);
  }
  const keysOrderedInlined = keysOrdered.join(SEPARATOR);

  const values: any[] = [];
  const keys = Object.keys(entity);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // skip the 'id' key
    if (key === FIELD_ID) {
      continue;
    }

    const keyTransformed = key as keyof typeof entity;
    values.push(entity[keyTransformed]);
  }

  return {
    keys: keysInlined,
    keysOrdered: keysOrderedInlined,
    values,
  };
};

const getKeysWithValues = (entity: Object): string => {
  const keysWithValuesMapped: any[] = [];
  const keys = Object.keys(entity);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // skip the 'id' key
    if (key === FIELD_ID) {
      continue;
    }

    const keyTransformed = key as keyof typeof entity;
    let valueTransformed = `${entity[keyTransformed]}`;

    const value = entity[keyTransformed];
    if (Array.isArray(value)) {
      const valueAsArr: any[] = value;
      valueTransformed = `{${valueAsArr.join(',')}}`;
    } else if (typeof value === 'object') {
      valueTransformed = JSON.stringify(value);
    }

    keysWithValuesMapped.push(`"${keyTransformed}" = '${valueTransformed}'`);
  }

  return keysWithValuesMapped.join(SEPARATOR);
};

const getKeysFromTable = (entity: Object, tableName: string, skipId = true): string => {
  const keysWithTable: any[] = [];
  const keys = Object.keys(entity);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // skip the 'id' key
    if (skipId && key === FIELD_ID) {
      continue;
    }

    keysWithTable.push(`${tableName}."${key}"`);
  }

  return keysWithTable.join(SEPARATOR);
};

export const PsqlUtils = {
  getOrderedKeysWithValues,
  getKeysWithValues,
  getKeysFromTable,
};
