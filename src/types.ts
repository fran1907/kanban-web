export type Priority = 'baja' | 'media' | 'alta';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Task {
  id: number;
  column_id: number;
  title: string;
  description: string | null;
  priority: Priority;
  due_date: string | null;
  position: number;
}

export interface Column {
  id: number;
  title: string;
  position: number;
  tasks: Task[];
}

export interface BoardSummary {
  id: number;
  title: string;
  created_at: string;
}

export interface Board extends BoardSummary {
  columns: Column[];
}
