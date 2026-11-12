import type { AuthResponse, Board, BoardSummary, Priority } from './types';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';
const TOKEN_KEY = 'kanban_token';

export const tokenStore = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function request<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. ¿Está arrancada la API?', 0);
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401 && token) {
      tokenStore.clear();
      window.dispatchEvent(new Event('auth:logout'));
    }
    throw new ApiError(data?.error ?? 'Error inesperado', res.status);
  }
  return data as T;
}

export const api = {
  register: (name: string, email: string, password: string) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: { name, email, password } }),
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: { email, password } }),

  listBoards: () => request<BoardSummary[]>('/boards'),
  createBoard: (title: string) => request<{ id: number; title: string }>('/boards', { method: 'POST', body: { title } }),
  getBoard: (id: number) => request<Board>(`/boards/${id}`),
  deleteBoard: (id: number) => request<{ deleted: boolean }>(`/boards/${id}`, { method: 'DELETE' }),

  addColumn: (boardId: number, title: string) =>
    request(`/boards/${boardId}/columns`, { method: 'POST', body: { title } }),
  deleteColumn: (id: number) => request(`/columns/${id}`, { method: 'DELETE' }),

  addTask: (columnId: number, title: string, priority: Priority) =>
    request(`/columns/${columnId}/tasks`, { method: 'POST', body: { title, priority } }),
  deleteTask: (id: number) => request(`/tasks/${id}`, { method: 'DELETE' }),
  moveTask: (id: number, columnId: number, position: number) =>
    request(`/tasks/${id}/move`, { method: 'PATCH', body: { column_id: columnId, position } }),
};
