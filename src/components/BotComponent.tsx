import ChatBotMessage from './ChatBotMessage';
import { conversations, generateToken, sendMessage } from '..//networking';
import {
  getAuthorization,
  getMessages,
  getUser,
  removeMessages,
  saveAuthorization,
  saveMessages,
  saveUser,
  setAuthorization,
} from '../networking/Client';
import type {
  Activity,
  RootObject as ReceiveMessageResponse,
} from '../networking/types/ReceiveMessages';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  AppState,
  AppStateStatus,
  StyleSheet,
  View,
} from 'react-native';
import { GiftedChat, GiftedChatProps } from 'react-native-gifted-chat';
import TypingIndicator from 'react-native-gifted-chat/lib/TypingIndicator';
import uuid from 'uuid';
import { refreshAccessToken } from '../networking/RefreshAccessToken';
import { AppConfig } from '../helpers';

type ExcludeGiftedChatProps = 'messages' | 'onSend' | 'user';

export interface BotComponentProp
  extends Omit<GiftedChatProps, ExcludeGiftedChatProps> {
  /**
   * Direct Line Key
   */
  directLineKey: string;
  userName: string;
  getConversationId?: (conversationId: string) => void;
}

const styles = StyleSheet.create({
  footerViewStyle: { paddingBottom: 50, marginLeft: 8 },
});

export const BotComponent: React.FC<BotComponentProp> = (props) => {
  const { directLineKey, userName, getConversationId } = props;
  const [waterMark, setWaterMark] = useState<string>('');
  const [typing, setTyping] = useState<boolean>(false);
  const gifterChatRef = useRef<GiftedChat>(null);
  const [messages, setMessages] = useState<
    {
      _id: number;
      text: string;
      createdAt: Date;
      user: {
        _id: number;
        name: string;
        avatar: string;
      };
    }[]
  >([]);
  const [user, setUser] = useState<{ _id: string; name: string }>();
  const [streamURL, setStreamURL] = useState<string>('');
  const [websoketURL, setWebsocketURL] = useState<any>();

  useEffect(() => {
    if (streamURL) {
      setWebsocketURL(new WebSocket(streamURL));
    }
  }, [streamURL]);

  useEffect(() => {
    if (websoketURL) {
      websoketURL.onopen = () => {
        console.log('Connected to the server');
      };
      websoketURL.onclose = (e: any) => {
        generateTokenApi();
        console.log('Disconnected. Check internet or server.', e);
      };
      websoketURL.onerror = (e: any) => {
        console.log('onerror', e);
      };
      websoketURL.onmessage = (e: any) => {
        const activities: ReceiveMessageResponse = e?.data
          ? JSON.parse(e?.data)
          : null;
        if (activities) {
          let result_activities: Activity[] = [];
          result_activities = activities?.activities?.map((item) => {
            const values = item?.suggestedActions?.actions?.map((_item) => {
              return {
                ..._item,
              };
            });
            const quickReplies = values?.length
              ? {
                  type: 'radio',
                  keepIt: true,
                  values,
                }
              : undefined;
            return {
              ...item,
              _id: item?.id,
              user: {
                _id: item?.from?.id,
                name: item?.from?.name,
              },
              quickReplies,
              createdAt: item?.timestamp,
            };
          });
          setWaterMark(activities?.watermark);
          setMessages((previousMessages) =>
            GiftedChat.prepend(previousMessages, result_activities as any)
          );
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [websoketURL]);

  const _renderFooter = () => {
    return (
      <View style={styles.footerViewStyle}>
        <TypingIndicator isTyping={typing} />
      </View>
    );
  };

  useEffect(() => {
    if (directLineKey) {
      getPastMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [directLineKey]);

  useEffect(() => {
    const refreshTokenApiInterval = setInterval(async () => {
      const result = await refreshAccessToken();
      setAuthorization(result?.data?.token);
      await saveAuthorization(
        result?.data?.token,
        result?.data?.conversationId
      );
      getConversationId?.(result?.data?.conversationId);
    }, AppConfig.REFRESH_TOKEN_TIMEOUT);
    return () => {
      clearInterval(refreshTokenApiInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPastMessages = async () => {
    const pastMessagesRes = await getMessages();
    if (directLineKey) {
      generateTokenApi();
      setMessages(pastMessagesRes?.messages);
      setWaterMark(pastMessagesRes?.waterMark!);
    }
  };

  useEffect(() => {
    if (user) {
      checkUserName();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (userName) {
      setUser({ _id: uuid?.v4(), name: userName });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]);

  const checkUserName = async () => {
    const userObj = await getUser();
    if (userObj === null) {
      saveUser(user);
    } else {
      if (userName !== userObj?.name) {
        setMessages([]);
        removeMessages();
        saveUser(user);
      }
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const setAuthorizationFunction = async () => {
    const authorization = await getAuthorization();
    setAuthorization(authorization?.accessToken!);
  };

  const handleAppStateChange = (state: AppStateStatus) => {
    if (state.match(/inactive|background/)) {
      savePast(); // update users status to inactive
    } else {
      return;
    }
  };

  const savePast = () => {
    saveMessages(messages, waterMark);
  };

  const generateTokenApi = async () => {
    try {
      const response = await generateToken(directLineKey);
      const result = await conversations(response?.data?.token);
      setAuthorization(result?.data?.token);
      setStreamURL(result?.data?.streamUrl);
      await saveAuthorization(
        result?.data?.token,
        result?.data?.conversationId
      );
      getConversationId?.(result?.data?.conversationId);
      setAuthorizationFunction();
    } catch (error: any) {
      console.log('error generateTokenApi', error);
    }
  };

  const onSend = useCallback(
    (_messages: any[] = []) => {
      msgsCall(_messages);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const msgsCall = async (m: any[]) => {
    const authorization = await getAuthorization();
    try {
      setTyping(true);
      await sendMessage(
        authorization?.conversationId!,
        m[0]?.text,
        m[0]?.user?._id,
        m[0]?.user?.name
      );
      // await callRecievedMessagesApi();
      setTyping(false);
      setTimeout(() => {
        gifterChatRef?.current?.scrollToBottom();
      }, 500);
    } catch (error) {
      console.log('msgsCall error', error);
      setTyping(false);
      Alert.alert(
        'Try again',
        "Hey you have lost you'r previous conversation due to inactive app usage, would you like to start again"
      );
    }
  };

  const _renderMessage = (messageProps: any) => {
    return (
      <ChatBotMessage
        {...messageProps}
        userObj={user}
        onQuickReply={(reply: any) => {
          const _messages = [
            {
              _id: uuid?.v4(),
              text: reply?.find((i: any) => i?.title)?.title,
              user: {
                _id: 1,
                name: userName,
              },
              createdAt: new Date(),
            },
          ];
          onSend(_messages);
        }}
      />
    );
  };

  return (
    <GiftedChat
      ref={gifterChatRef}
      inverted={false}
      messages={messages}
      onSend={onSend}
      user={{
        _id: 1,
        name: userName,
      }}
      scrollToBottom={typing}
      renderMessage={_renderMessage}
      renderFooter={_renderFooter}
      {...props}
    />
  );
};
