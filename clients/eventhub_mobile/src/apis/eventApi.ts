import axiosClient from './axiosClient';

class EventAPI {
  HandlerEvent = async (
    url: string,
    data?: any,
    method?: 'get' | 'post' | 'put' | 'delete',
  ) => {
    return await axiosClient(`/events${url}`, {
      method: method ?? 'get',
      data,
    });
  };

  deleteEvent = async (id: string) => {
    return await this.HandlerEvent(`/delete-event?id=${id}`, null, 'delete');
  };
}

const eventAPI = new EventAPI();
export default eventAPI;
