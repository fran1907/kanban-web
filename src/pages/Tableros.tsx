import { useEffect, useState } from 'react';
import { borrarTablero, crearTablero, listarTableros } from '../api';
import type { TableroResumen } from '../types';

interface Props {
  abrirTablero: (id: number) => void;
}

// Lista de tableros del usuario, con formulario para crear uno nuevo
export default function Tableros({ abrirTablero }: Props) {
  const [tableros, setTableros] = useState<TableroResumen[]>([]);
  const [titulo, setTitulo] = useState('');
  const [error, setError] = useState('');

  async function cargar() {
    try {
      setTableros(await listarTableros());
    } catch (err) {
      setError((err as Error).message);
    }
  }

  // Se ejecuta una sola vez, cuando la pantalla aparece
  useEffect(() => {
    cargar();
  }, []);

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    if (titulo.trim() === '') return;

    try {
      await crearTablero(titulo);
      setTitulo('');
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function borrar(id: number) {
    if (!confirm('¿Borrar este tablero y todas sus tareas?')) return;

    try {
      await borrarTablero(id);
      cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <section>
      <h1>Mis tableros</h1>

      <form className="inline-form" onSubmit={crear}>
        <input
          placeholder="Nombre del nuevo tablero"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <button className="btn">Crear tablero</button>
      </form>

      {error && <p className="error">{error}</p>}
      {tableros.length === 0 && <p className="muted">Todavía no tienes tableros. ¡Crea el primero!</p>}

      <div className="board-grid">
        {tableros.map((tablero) => (
          <div key={tablero.id} className="board-card">
            <button className="link" onClick={() => abrirTablero(tablero.id)}>
              {tablero.title}
            </button>
            <button className="btn btn-ghost btn-small" onClick={() => borrar(tablero.id)}>
              Borrar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
