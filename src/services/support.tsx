import { setChat, store } from "../redux/store";
import { api } from "./config";

export async function closeChatTicket(chatId: string): Promise<any> {
  try {
    await api.patch(`api/admin/support/chats/${chatId}/close`);
  } catch (error) {}
}

export async function getSupportMsgs(chatId: string): Promise<any> {
  try {
    const res = await api.get(`api/admin/support/chats/${chatId}/msgs`);
    store.dispatch(setChat(res.data));
  } catch (error) {}
}
