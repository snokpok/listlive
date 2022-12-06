import axios from 'axios';
import { serverConfigs } from '../configs';

export const axiosReqGetMyLists = (
  token: string | null,
  leftJoined: number,
) => {
  const axiosReq = axios({
    method: `get`,
    url: `${serverConfigs.BACKEND_URL}/lists/?left_joined=${leftJoined}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return axiosReq;
};

export const axiosReqGetListsUser = (token: string | null, userId: string) => {
  const axiosReq = axios({
    method: `get`,
    url: `${serverConfigs.BACKEND_URL}/users/${userId}/lists`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return axiosReq;
};

export const axiosReqGetListById = (
  token: string | null,
  id: string,
  includeItems: number,
) =>
  axios({
    method: `get`,
    url: `${serverConfigs.BACKEND_URL}/lists/${id}/?include_items=${includeItems}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

interface IListInputFields {
  title: string;
  description?: string;
}
export const axiosReqCreateList = (
  token: string | null,
  input: IListInputFields,
) =>
  axios({
    method: `post`,
    url: `${serverConfigs.BACKEND_URL}/lists/`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: input,
  });

export const axiosReqEditListAttribs = (
  token: string | null,
  input: IListInputFields,
  listId: string,
) =>
  axios({
    method: `put`,
    url: `${serverConfigs.BACKEND_URL}/lists/${listId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: input,
  });

interface ITodoInputFields {
  title: string;
  description: string;
}
export const axiosReqCreateItemAtList = (
  token: string | null,
  todoInputFields: ITodoInputFields,
  listId: string,
) => {
  const axiosReq = axios({
    method: `post`,
    url: `${serverConfigs.BACKEND_URL}/lists/${listId}/item`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: todoInputFields,
  });
  return axiosReq;
};

export const axiosReqDeleteItem = (
  token: string | null,
  listId: string,
  itemId: string,
) => {
  const axiosReq = axios({
    method: `delete`,
    url: `${serverConfigs.BACKEND_URL}/lists/${listId}/item/${itemId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return axiosReq;
};

export const axiosReqEditItem = (
  token: string | null,
  listId: string,
  itemId: string,
  todoInputFields: ITodoInputFields,
) => {
  const axiosReq = axios({
    method: `put`,
    url: `${serverConfigs.BACKEND_URL}/lists/${listId}/item/${itemId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: todoInputFields,
  });
  return axiosReq;
};

interface EditTodoOrder {
  newOrder: number;
}

export const axiosReqChangeItemOrder = (
  token: string | null,
  body: EditTodoOrder,
  listId: string,
  itemId: string,
) => {
  const axiosReq = axios({
    method: `put`,
    url: `${serverConfigs.BACKEND_URL}/lists/${listId}/item/${itemId}/change-order`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      new_order: body.newOrder,
    },
  });
  return axiosReq;
};

export const axiosReqDecodeToken = (token: string | null) =>
  axios({
    method: `get`,
    url: `${serverConfigs.BACKEND_URL}/auth/decode-token?token=${token}`,
  });

export const axiosReqGetUsers = (token: string | null) =>
  axios({
    method: `get`,
    url: `${serverConfigs.BACKEND_URL}/users`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const axiosReqDeleteList = (token: string | null, listId: string) =>
  axios({
    method: `delete`,
    url: `${serverConfigs.BACKEND_URL}/lists/${listId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const axiosReqChangeAttribsUser = (
  token: string | null,
  emoji: string,
) =>
  axios({
    method: `put`,
    url: `${serverConfigs.BACKEND_URL}/users/me`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      profile_emoji: emoji,
    },
  });
