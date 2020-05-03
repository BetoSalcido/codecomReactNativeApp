import { AsyncStorage } from "react-native";
import moment from 'moment';

class Utils {
  storeData = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (e) {
      // saving error
    }
  }

  getStoreData = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key)
      return value
    } catch (e) {
      // error reading value
    }
  }

  deleteStoreData = async () => {
    try {
      await AsyncStorage.clear()
    } catch (e) {
      // error reading value
    }
  }

  formatDate = (date: Date): string => {
    return date.toString().split('T')[0];
  }

  formatDatetime = (date: Date): string => {
    return moment(date).local().format('YYYY-MM-DD HH:mm:ss');
  }

}

export default new Utils();