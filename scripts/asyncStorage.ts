import AsyncStorage from '@react-native-async-storage/async-storage';

class AsyncStorageService {
  private static instance: AsyncStorageService;

  private constructor() {}

  static getInstance() {
    if (!AsyncStorageService.instance) {
      AsyncStorageService.instance = new AsyncStorageService();
    }
    return AsyncStorageService.instance;
  }

  async storeData(key: string, value: string) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      throw new Error(`Error message is:${err}`);
    }
  }

  async removeData(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (err) {
      throw new Error(`Error message is:${err}`);
    }
  }

  async getData(key: string) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (err) {
      throw new Error(`Error message is:${err}`);
    }
  }

  async multiRemove(keys: string[]) {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (err) {
      throw new Error(`Error message is:${err}`);
    }
  }
}

export const storage = AsyncStorageService.getInstance()
