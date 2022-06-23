import { client } from './Client';
import type { RootObject as Conversations } from './types/Conversations';
import type { AxiosPromise } from 'axios';

export const conversations = (token: string): AxiosPromise<Conversations> => {
  return client({
    method: 'post',
    url: '/conversations',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
