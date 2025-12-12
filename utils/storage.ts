import AsyncStorage from '@react-native-async-storage/async-storage';
import { PendingSync } from '@/types';

const KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  PENDING_SYNC: 'pendingSync',
  LANGUAGE: 'language',
};

export const storage = {
  auth: {
    setToken: async (token: string) => {
      await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
    },
    getToken: async () => {
      return await AsyncStorage.getItem(KEYS.AUTH_TOKEN);
    },
    removeToken: async () => {
      await AsyncStorage.removeItem(KEYS.AUTH_TOKEN);
    },
  },

  user: {
    setData: async (data: any) => {
      await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(data));
    },
    getData: async () => {
      const data = await AsyncStorage.getItem(KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    },
    removeData: async () => {
      await AsyncStorage.removeItem(KEYS.USER_DATA);
    },
  },

  sync: {
    addPending: async (item: Omit<PendingSync, 'id' | 'timestamp'>) => {
      const pending = await storage.sync.getPending();
      const newItem: PendingSync = {
        ...item,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      pending.push(newItem);
      await AsyncStorage.setItem(KEYS.PENDING_SYNC, JSON.stringify(pending));
      return newItem;
    },
    getPending: async (): Promise<PendingSync[]> => {
      const data = await AsyncStorage.getItem(KEYS.PENDING_SYNC);
      return data ? JSON.parse(data) : [];
    },
    removePending: async (id: string) => {
      const pending = await storage.sync.getPending();
      const filtered = pending.filter((item) => item.id !== id);
      await AsyncStorage.setItem(KEYS.PENDING_SYNC, JSON.stringify(filtered));
    },
    clearPending: async () => {
      await AsyncStorage.setItem(KEYS.PENDING_SYNC, JSON.stringify([]));
    },
  },

  settings: {
    setLanguage: async (lang: string) => {
      await AsyncStorage.setItem(KEYS.LANGUAGE, lang);
    },
    getLanguage: async () => {
      return (await AsyncStorage.getItem(KEYS.LANGUAGE)) || 'en';
    },
  },

  clearAll: async () => {
    await AsyncStorage.multiRemove([
      KEYS.AUTH_TOKEN,
      KEYS.USER_DATA,
      KEYS.PENDING_SYNC,
    ]);
  },
};
