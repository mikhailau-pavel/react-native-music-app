import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (err) {
    throw new Error(`Error message is:${err}`);
  }
};

const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    throw new Error(`Error message is:${err}`);
  }
};

const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (err) {
    throw new Error(`Error message is:${err}`);
  }
};

export { storeData, getData, removeData };
