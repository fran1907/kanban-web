import { useState } from 'react';
import Login from './pages/Login';
import Tableros from './pages/Tableros';
import TableroAbierto from './pages/TableroAbierto';
import type { Usuario } from './types';

// Componente principal. Decide qué pantalla se muestra:
//   - sin usuario            -> Login
//   - con usuario            -> lista de tableros
//   - con un tablero elegido -> ese tablero
export default function App() {
  // Al abrir la página, recuperamos el usuario guardado en el navegador (si lo hay)
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });
  const [tableroId, setTableroId] = useState<number | null>(null);

  function alEntrar(token: string, usuario: Usuario) {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    setUsuario(usuario);
  }

  function salir() {
    localStorage.clear();
    setUsuario(null);
    setTableroId(null);
  }

  return (
    <>
      <header className="topbar">
        <span className="brand">Kanban</span>
        {usuario && (
          <div className="topbar-right">
            <span>Hola, {usuario.name}</span>
            <button className="btn btn-ghost" onClick={salir}>
              Salir
            </button>
          </div>
        )}
      </header>

      <main className="container">
        {!usuario && <Login alEntrar={alEntrar} />}
        {usuario && tableroId === null && <Tableros abrirTablero={setTableroId} />}
        {usuario && tableroId !== null && (
          <TableroAbierto id={tableroId} volver={() => setTableroId(null)} />
        )}
      </main>
    </>
  );
}
