import { Base64Utils } from './Base64Utils';

const getBasicAuthorizationHeader = (userName: string, password: string): string => {
  const encoded = Base64Utils.encode(`${userName}:${password}`);
  return `Basic ${encoded}`;
};

export const AuthUtils = {
  getBasicAuthorizationHeader,
};
