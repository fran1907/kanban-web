# Kanban Web

Frontend de un gestor de tareas estilo Kanban, hecho con **React 18 + TypeScript + Vite**. Consume la API REST de [kanban-api-php](https://github.com/fran1907/kanban-api-php).

## Funcionalidades

- Registro e inicio de sesión (JWT guardado en `localStorage`)
- Rutas protegidas con React Router
- Crear y borrar tableros
- Columnas y tareas con prioridad (baja, media, alta)
- **Arrastrar y soltar** tareas entre columnas y reordenarlas (API nativa de HTML5, sin librerías extra)
- Gestión de errores de red y de sesión caducada

## Tecnologías

React 18, TypeScript (modo estricto), Vite, React Router, Context API para la autenticación y CSS propio.

## Estructura

```
src/
├── api.ts            # Cliente HTTP tipado hacia la API
├── auth.tsx          # Contexto de autenticación
├── types.ts          # Tipos compartidos (Board, Column, Task...)
├── App.tsx           # Rutas y barra superior
└── pages/
    ├── Login.tsx     # Login y registro
    ├── Boards.tsx    # Lista de tableros
    └── BoardPage.tsx # Tablero con columnas y drag and drop
```

## Puesta en marcha

Necesitas tener la API funcionando en `http://localhost:8000` (ver el README de `kanban-api-php`).

```bash
npm install
cp .env.example .env      # en Windows: copy .env.example .env
npm run dev
```

La app se abre en `http://localhost:5173`.

Para generar la versión de producción: `npm run build`.

## Configuración

| Variable | Descripción | Por defecto |
|----------|-------------|-------------|
| `VITE_API_URL` | URL base de la API | `http://localhost:8000/api` |

## Próximos pasos

- [ ] Editar título, descripción y fecha de las tareas
- [ ] Renombrar columnas
- [ ] Tests con Vitest y Testing Library
- [ ] Despliegue en Vercel

## Licencia

MIT
