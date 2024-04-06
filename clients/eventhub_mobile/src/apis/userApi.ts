import axiosClient from './axiosClient';

class UserAPI {
  HandlerUser = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put' | 'delete',
  ) => {
    return await axiosClient(`/users${url}`, {
      method: method ?? 'get',
      data,
    });
  };
}

const userAPI = new UserAPI();
export default userAPI;
