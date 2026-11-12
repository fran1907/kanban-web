import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import type { BoardSummary } from '../types';

export default function Boards() {
  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setBoards(await api.listBoards());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await api.createBoard(title.trim());
      setTitle('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm('¿Borrar este tablero y todas sus tareas?')) return;
    try {
      await api.deleteBoard(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    }
  };

  return (
    <section>
      <h1>Mis tableros</h1>

      <form onSubmit={onCreate} className="inline-form">
        <input
          placeholder="Nombre del nuevo tablero"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="btn">Crear tablero</button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p>Cargando…</p>}
      {!loading && boards.length === 0 && <p className="muted">Todavía no tienes tableros. ¡Crea el primero!</p>}

      <div className="board-grid">
        {boards.map((b) => (
          <div key={b.id} className="board-card">
            <Link to={`/boards/${b.id}`} className="board-link">
              {b.title}
            </Link>
            <button className="btn btn-ghost btn-small" onClick={() => onDelete(b.id)}>
              Borrar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
