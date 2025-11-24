import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api/notes";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const client = axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: `Bearer ${TOKEN}` },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string; // ← ДОДАНО
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async (params: FetchNotesParams = {}) => {
  const { data } = await client.get<FetchNotesResponse>("", {
    params: {
      page: params.page ?? 1,
      perPage: params.perPage ?? 12,
      search: params.search ?? "", // ← ДОДАНО
    },
  });
  return data;
};

export const createNote = async (body: CreateNoteParams) => {
  const { data } = await client.post<Note>("", body);
  return data;
};

export const deleteNote = async (id: string) => {
  const { data } = await client.delete<Note>(`/${id}`);
  return data;
};
