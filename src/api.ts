// Aquí están todas las llamadas a la API (backend en PHP).
// Si cambias la dirección de la API, solo tienes que cambiarla en esta línea:
const URL_API = 'http://localhost:8000/api';

// Función general: hace la petición, envía el token y devuelve los datos en JSON.
async function llamar(ruta: string, metodo = 'GET', cuerpo?: object) {
  const token = localStorage.getItem('token');
  let respuesta: Response;

  try {
    respuesta = await fetch(URL_API + ruta, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    throw new Error('No se pudo conectar con la API. ¿Está arrancada?');
  }

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    // Si la sesión ya no es válida, volvemos a la pantalla de login
    if (respuesta.status === 401 && !ruta.startsWith('/auth')) {
      localStorage.clear();
      window.location.reload();
    }
    throw new Error(datos.error || 'Error inesperado');
  }

  return datos;
}

// ---- Usuarios ----
export function registrar(name: string, email: string, password: string) {
  return llamar('/auth/register', 'POST', { name, email, password });
}

export function iniciarSesion(email: string, password: string) {
  return llamar('/auth/login', 'POST', { email, password });
}

// ---- Tableros ----
export function listarTableros() {
  return llamar('/boards');
}

export function crearTablero(title: string) {
  return llamar('/boards', 'POST', { title });
}

export function verTablero(id: number) {
  return llamar('/boards/' + id);
}

export function borrarTablero(id: number) {
  return llamar('/boards/' + id, 'DELETE');
}

// ---- Columnas ----
export function crearColumna(tableroId: number, title: string) {
  return llamar('/boards/' + tableroId + '/columns', 'POST', { title });
}

export function borrarColumna(id: number) {
  return llamar('/columns/' + id, 'DELETE');
}

// ---- Tareas ----
export function crearTarea(columnaId: number, title: string, priority: string) {
  return llamar('/columns/' + columnaId + '/tasks', 'POST', { title, priority });
}

export function borrarTarea(id: number) {
  return llamar('/tasks/' + id, 'DELETE');
}

export function moverTarea(id: number, columnaId: number) {
  return llamar('/tasks/' + id + '/move', 'PATCH', { column_id: columnaId });
}
