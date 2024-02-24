import AsyncStorage from '@react-native-async-storage/async-storage';
import KeyNames from '@utils/KeyNames';


const STORAGE_KEY = KeyNames.authToken;

export const storeToken = async (value) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, value);
    console.log('Data saved successfully');
    return value;
  } catch (error) {
    console.log('Error saving data:', error);
    throw error;
  }
};

export const getToken = async () => {
  try {
    const result = await AsyncStorage.getItem(STORAGE_KEY);
    if (result === null) {
      //console.log('User is not logged in');
      return null;
    } else {
      //console.log('Data retrieved successfully:', result);
      return result;
    }
  } catch (error) {
    console.log('Error retrieving data:', error);
    throw error;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('Data removed successfully');
    return 'Data removed successfully';
  } catch (error) {
    console.log('Error removing data:', error);
    throw error
  }
};