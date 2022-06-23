import { client } from './Client';
import type { RootObject as SendMessage } from './types/SendMessage';
import type { AxiosPromise } from 'axios';

export const sendMessage = (
  cid: string,
  message: string,
  userId: string,
  userName: string
): AxiosPromise<SendMessage> => {
  return client({
    method: 'post',
    url: `/conversations/${cid}/activities`,
    data: {
      locale: 'en-EN',
      type: 'message',
      from: {
        id: userId,
        name: userName,
      },
      text: message,
    },
  });
};
