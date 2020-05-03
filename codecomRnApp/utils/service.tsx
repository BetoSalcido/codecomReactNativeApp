import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInstance,
  AxiosAdapter,
  Cancel,
  CancelToken,
  CancelTokenSource,
  Canceler
} from 'axios';
import { API_BASE_URL } from './constants';
import utils from './utils';
import { ToastAndroid } from 'react-native';

// export abstract class ApiService {
//   public url: string;
//   public logutBehaivor: any;

//   constructor(url: string) {
//     this.url = url;
//   }

//   protected abstract getHeaders() : AxiosRequestConfig["headers"];
//   protected abstract validate(request: Promise<any>) : Promise<any>;

//   public get(path: string, params?: any): Promise<any> {
//     return this.validate(this.http.get(`${this.url}${path}`, params));
//   }


// }



const config: AxiosRequestConfig = {};

const handleResponse = async (response: AxiosResponse) => {
  return response.data
};

const handleError = async (error: AxiosError, logOut?) => {
  if (error.response) {
    let errorMsg = '';
    switch (error.response.status) {
      case 401:
        await utils.deleteStoreData();
        if (logout) {
          logout();
        }
        break;
      case 404:
        errorMsg = 'No se encontró el servicio';
        break;
      case 500:
        errorMsg = 'Ocurrió un error al consultar el servidor';
        break;
    }
    if (errorMsg) {
      ToastAndroid.show(`${errorMsg}`, ToastAndroid.SHORT);
    }
  } else {
    ToastAndroid.show(`${error.message}`, ToastAndroid.SHORT);
  }
};

axios.interceptors.request.use(async config => {
  config.baseURL = `${API_BASE_URL}`;
  config.headers = {
    'Content-Type': 'application/json',
    'Authorization': await utils.getStoreData('token')
  }
  return config;
})


var logout: any;
const sendRequest = async (api: string, type: string, data?: any, params?: any, logOut?: any) => {
  if (logOut) {
    logout = logOut;
  }

  switch (type) {
    case 'get':
      return await axios.get(`${api}`, { params })
        .then(handleResponse)
        .catch(handleError);
      break;
    case 'post':
      return await axios.post(`${api}`, data)
        .then(handleResponse)
        .catch(handleError);
      break;
  }
}

async function setTokenHeader() {
  const token = await utils.getStoreData('token')
  if (!token) //logout
    axios.defaults.headers.common['Authorization'] = token;
}

setTokenHeader();


axios(config);
export const callService = sendRequest
