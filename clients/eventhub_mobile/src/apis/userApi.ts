import {appInfo} from '../constants/appInfos';
import axiosClient from './axiosClient';

class UserAPI {
  HandlerUser = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put' | 'delete',
  ) => {
    return await axiosClient(`/user${url}`, {
      method: method ?? 'get',
      data,
    });
  };
}

const userAPI = new UserAPI();
export default userAPI;
