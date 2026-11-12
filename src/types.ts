// Tipos de TypeScript: describen la forma de los datos que devuelve la API.

export interface Usuario {
  id: number;
  name: string;
  email: string;
}

export interface Tarea {
  id: number;
  column_id: number;
  title: string;
  description: string | null;
  priority: 'baja' | 'media' | 'alta';
}

export interface Columna {
  id: number;
  title: string;
  tasks: Tarea[];
}

// Lo que devuelve la lista de tableros
export interface TableroResumen {
  id: number;
  title: string;
}

// Lo que devuelve un tablero abierto: incluye sus columnas y tareas
export interface Tablero extends TableroResumen {
  columns: Columna[];
}
