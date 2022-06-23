import { client } from './Client';
import type { RootObject as ReceiveMessages } from './types/ReceiveMessages';
import type { AxiosPromise } from 'axios';

export const receiveMessages = (
  conversationId: string,
  watermark?: string
): AxiosPromise<ReceiveMessages> => {
  return client({
    method: 'get',
    url: `/conversations/${conversationId}/activities?${
      watermark && `watermark=${watermark}`
    }`,
  });
};
