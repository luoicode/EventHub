import axiosClient from './axiosClient';

class EventAPI {
  HandlerEvent = async (
    url: string,
    method: 'get' | 'post' | 'put' | 'delete' = 'get',
    data?: any,
  ) => {
    return await axiosClient(`/events${url}`, {
      method,
      data,
    });
  };

  deleteEvent = async (id: string) => {
    return await this.HandlerEvent(`/delete-event?id=${id}`, 'delete');
  };
}

const eventAPI = new EventAPI();
export default eventAPI;
