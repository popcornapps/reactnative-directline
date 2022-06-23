import type { AxiosPromise } from 'axios';
import { client } from '.';

import type { RootObject as RefreshAccessToken } from './types/RefreshAccessToken';

export const refreshAccessToken = (): AxiosPromise<RefreshAccessToken> => {
  return client({
    method: 'post',
    url: '/tokens/refresh',
  });
};
