/* eslint-disable @typescript-eslint/no-explicit-any */
// api.ts
import axios from "axios";
import { BASE_URL } from "../constants/baseUrl";
import { CreateChannelResponse } from "../types/types";

// Assuming you're using environment variables for the base URL in a production setup
const baseURL = BASE_URL; // Fallback for development

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getStreamMessages = (channelId: string): Promise<any> => {
  // This function is shown for completeness, but EventSource directly handles the stream connection.
  // It would be used if you were doing periodic long-polling GETs instead of SSE.
  return api.get(`/stream/messages/${channelId}`);
};

export const sendMessage = async (payload: FormData): Promise<void> => {
  // Axios will automatically handle the Content-Type header for FormData
  await api.post<void>("/stream/send-message", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const createChannel = async (
  customerId: string
): Promise<CreateChannelResponse> => {
  // Axios will return AxiosResponse<CreateChannelResponse>. We extract the 'data' property.
  const response = await api.post<CreateChannelResponse>("/stream/channel", {
    customerId,
  });
  return response.data;
};

// New function for editing messages
export const editMessage = async (
  userId: string,
  messageId: string,
  text: string
): Promise<void> => {
  await api.put<void>("/stream/edit-message", { userId, messageId, text });
};
