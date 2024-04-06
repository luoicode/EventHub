import axiosClient from './axiosClient';

class AuthAPI {
  HandlerAuthentication = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put' | 'delete',
  ) => {
    return await axiosClient(`/auth${url}`, {
      method: method ?? 'get',
      data,
    });
  };
}

const authenticationAPI = new AuthAPI();
export default authenticationAPI;
