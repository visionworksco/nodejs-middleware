const fromString = (value: string): boolean => {
  return JSON.parse(value);
};

export const BooleanUtils = {
  fromString,
};
