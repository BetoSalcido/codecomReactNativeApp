import { ToastAndroid } from "react-native";
import utils from "../../utils/utils";
import { API_BASE_URL } from "../../utils/constants";
import { callService } from "../../utils/service";

export default class API {
  private behaivorHandler
  constructor(behaivorHandler: any) {
    this.behaivorHandler = behaivorHandler;
  }
  async login(phoneNumber: string, password: string) {
    const pushNotificationToken = await utils.getStoreData('pushNotificationToken');
    const req: Promise<any> = fetch(`${API_BASE_URL}/auth/admin`, {
      method: 'POST',
      body: JSON.stringify({
        phoneNumber: `+52${phoneNumber}`,
        password,
        pushNotificationToken,
        deviceType: 'Mobile'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json())
      .then((responseJson) => {
        return this.callback(responseJson);
      })
      .catch((error) => console.log(error.message))

    const result: { token: string; } = await req;
    if (result) {
      await utils.storeData('token', result.token);
    }

    return result;
  }

  async loadNotifications(skip: number, limit: number): Promise<any[]> {
    return await callService('/notifications', 'get', null, {skip, limit}, this.behaivorHandler)
  }

  // async loadNotifications(offset: number, limit: number) {
  //   const token = await utils.getStoreData('token');

  //   return fetch(`${API_BASE_URL}/notifications?skip=${offset}&limit=${limit}`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': token ? token.toString() : null
  //     }
  //   }).then((res) => {
  //     return res.json()
  //   })
  //     .then((responseJson) => {
  //       return this.callback(responseJson);
  //     })
  //     .catch((error) => {
  //       console.log(error);

  //       console.log({ error: error.message })
  //     })
  // }


  private async callback(data: any) {
    if (data && data.status) {
      if (data.status == 401) {

        utils.deleteStoreData();
        // App({navigation: 'SIGN_OUT'});
      } else if (data.status != 200) {
        ToastAndroid.show(`${data.message}`, ToastAndroid.SHORT);
      } else {
        return data
      }
    } else {
      return data
    }
  }

  // private async callback(data: any) {
  //   if (data && data.status) {

  //     switch (data.status) {
  //       case 401:
  //           await utils.deleteStoreData();
  //           ToastAndroid.show(`${data.message}`, ToastAndroid.SHORT);
  //         break;
  //       case 404:
  //           ToastAndroid.show(`Ocurrio un error`, ToastAndroid.SHORT);
  //         break;
  //       default:
  //           ToastAndroid.show(`${data.message}`, ToastAndroid.SHORT);
  //         break;
  //     }
  //   } else {
  //     return data.json()
  //   }
  // }
}

// export default new API();