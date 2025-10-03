import { setChat, setChats, store } from "../redux/store";
import { api } from "./config";

export async function getSupportChats(
  page_: number,
  isUpdate: boolean
): Promise<any> {
  try {
    const res = await api.get(`api/admin/support/chats?page=${page_}`);
    const total = Number(res.headers["x-total"]);
    const page = Number(res.headers["x-page"]);
    store.dispatch(setChats({ total, page, data: res.data }));
    if (res.data.length > 0 && !isUpdate) getSupportMsgs(res.data[0]);
    return { total, page, data: res.data };
  } catch (error) {}
}

export async function getSupportMsgs(chat: any): Promise<any> {
  try {
    const res = await api.get(`api/admin/support/chats/${chat._id}/msgs`);
    const _p = {
      chats: res.data,
      _id: chat._id,
      registerd: chat.registerd,
      userId: chat.userId,
      accesLogId: chat.accesLogId,
    };
    store.dispatch(setChat(_p));
  } catch (error) {}
}
