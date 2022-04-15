const ENCODING = 'utf-8';
const BASE64 = 'base64';

const encode = (stringValue: string): string => {
  return Buffer.from(stringValue, ENCODING).toString(BASE64);
};

const decode = (base64Value: string): string => {
  return Buffer.from(base64Value, BASE64).toString(ENCODING);
};

export const Base64Utils = {
  encode,
  decode,
};
