import { client } from './Client';
import type { RootObject as GenerateToken } from './types/GenerateToken';
import type { AxiosPromise } from 'axios';

export const generateToken = (
  bearerToken?: string
): AxiosPromise<GenerateToken> => {
  return client({
    method: 'post',
    url: '/tokens/generate',
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });
};
