import { AppConfig } from '../helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { generateToken } from './GenerateToken';
import { conversations } from './Conversations';

// axios.defaults.timeout = 6000;
const client = axios.create({
  baseURL: AppConfig.API_BASE_URL,
  headers: {},
});

export { client };

export const setAuthorization = (accessToken: string | null) => {
  client.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
};

export const saveAuthorization = async (
  accessToken: string,
  conversationId: string
) => {
  await AsyncStorage.setItem(
    'Authorization',
    JSON.stringify({
      accessToken,
      conversationId,
    })
  );
};

export const refreshAuthLogic = async () => {
  await removeMessages();
  await removeAuthorization();
  generateTokenApi();
};

// Instantiate the interceptor (you can chain it as it returns the axios instance)
// TODO: Fix no response from few APIs when enabled.
createAuthRefreshInterceptor(client, refreshAuthLogic, {
  statusCodes: [401, 403],
});

const generateTokenApi = async () => {
  try {
    const response = await generateToken();
    const result = await conversations(response?.data?.token);
    setAuthorization(result?.data?.token);
    saveAuthorization(result?.data?.token, result?.data?.conversationId);
  } catch (error: any) {
    console.log('error', error);
  }
};

export const getAuthorization = async (): Promise<{
  accessToken: string;
  conversationId: string;
} | null> => {
  const authorization = await AsyncStorage.getItem('Authorization');
  return authorization ? JSON.parse(authorization) : null;
};

export const removeAuthorization = async () => {
  await AsyncStorage.removeItem('Authorization');
};

export const removeMessages = async () => {
  await AsyncStorage.removeItem('Messages');
};

export const saveMessages = async (messages: any, waterMark: string) => {
  await AsyncStorage.setItem(
    'Messages',
    JSON.stringify({ messages, waterMark })
  );
};

export const getMessages = async (): Promise<{
  messages: any;
  waterMark: string;
} | null> => {
  const messagesRes = await AsyncStorage.getItem('Messages');
  return messagesRes ? JSON.parse(messagesRes) : null;
};

export const saveUser = async (user: any) => {
  await AsyncStorage.setItem('UserDetails', JSON.stringify({ ...user }));
};

export const getUser = async (): Promise<{
  name: string;
  id: string;
} | null> => {
  const user = await AsyncStorage.getItem('UserDetails');
  return user ? JSON.parse(user) : null;
};
