# Kanban Web

Frontend de un gestor de tareas estilo Kanban, hecho con **React + TypeScript + Vite**. Consume la API de [kanban-api-php](https://github.com/fran1907/kanban-api-php).

## Funcionalidades

- Registro e inicio de sesión
- Crear y borrar tableros
- Añadir y borrar columnas y tareas, con prioridad (baja, media o alta)
- **Arrastrar y soltar** tareas entre columnas

## Tecnologías

React 18 (componentes de función, `useState` y `useEffect`), TypeScript, Vite y CSS.

## Estructura

```
src/
├── main.tsx                  # Arranque de la aplicación
├── App.tsx                   # Decide qué pantalla se muestra
├── api.ts                    # Todas las llamadas a la API (fetch)
├── types.ts                  # Tipos de TypeScript (Tablero, Columna, Tarea...)
├── styles.css
└── pages/
    ├── Login.tsx             # Login y registro
    ├── Tableros.tsx          # Lista de tableros
    └── TableroAbierto.tsx    # Un tablero con sus columnas y tareas
```

### Cómo funciona

- `App.tsx` guarda en el estado si hay un usuario y qué tablero está abierto, y según eso muestra `Login`, `Tableros` o `TableroAbierto`.
- Cuando inicias sesión, la API devuelve un **token**. Se guarda en `localStorage` y `api.ts` lo envía en cada petición.
- Las pantallas llaman a las funciones de `api.ts` (por ejemplo `crearTarea()`), y después vuelven a cargar los datos para mostrarlos actualizados.
- El arrastre usa el drag and drop nativo de HTML: al empezar a arrastrar una tarea se guarda su id y, al soltarla sobre una columna, se llama a la API para moverla.

## Puesta en marcha

Necesitas Node.js y la API funcionando en `http://localhost:8000` (mira el README de `kanban-api-php`).

```bash
npm install
npm run dev
```

La aplicación se abre en `http://localhost:5173`.

Si la API está en otra dirección, cambia la constante `URL_API` al principio de `src/api.ts`.

## Cómo arrancarlo cada día

1. XAMPP: *Start* en MySQL.
2. Terminal 1, en `kanban-api-php`: `php -S localhost:8000 -t public`
3. Terminal 2, en `kanban-web`: `npm run dev`
4. Abrir `http://localhost:5173`

## Próximos pasos

- [ ] Editar tareas (título y descripción)
- [ ] Reordenar tareas dentro de una columna
- [ ] Desplegar en Vercel

## Licencia

MIT
