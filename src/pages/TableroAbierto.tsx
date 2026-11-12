import { useEffect, useState } from 'react';
import {
  borrarColumna,
  borrarTarea,
  crearColumna,
  crearTarea,
  moverTarea,
  verTablero,
} from '../api';
import type { Columna, Tablero } from '../types';

interface Props {
  id: number;
  volver: () => void;
}

// Un tablero con sus columnas y tareas. Las tareas se pueden arrastrar de una columna a otra.
export default function TableroAbierto({ id, volver }: Props) {
  const [tablero, setTablero] = useState<Tablero | null>(null);
  const [error, setError] = useState('');
  const [nuevaColumna, setNuevaColumna] = useState('');
  // id de la tarea que se está arrastrando en este momento
  const [tareaArrastrada, setTareaArrastrada] = useState<number | null>(null);

  async function cargar() {
    try {
      setTablero(await verTablero(id));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  // Ejecuta una acción de la API y, si sale bien, vuelve a cargar el tablero
  async function ejecutar(accion: () => Promise<unknown>) {
    try {
      await accion();
      await cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function añadirColumna(e: React.FormEvent) {
    e.preventDefault();
    if (nuevaColumna.trim() === '') return;
    ejecutar(() => crearColumna(id, nuevaColumna));
    setNuevaColumna('');
  }

  function quitarColumna(columna: Columna) {
    if (!confirm('¿Borrar la columna "' + columna.title + '" y sus tareas?')) return;
    ejecutar(() => borrarColumna(columna.id));
  }

  // Se ejecuta cuando se suelta una tarea sobre una columna
  function soltarEn(columnaId: number) {
    if (tareaArrastrada === null) return;
    const tareaId = tareaArrastrada;
    setTareaArrastrada(null);
    ejecutar(() => moverTarea(tareaId, columnaId));
  }

  if (tablero === null) {
    return (
      <section>
        <button className="link" onClick={volver}>← Volver</button>
        {error ? <p className="error">{error}</p> : <p>Cargando…</p>}
      </section>
    );
  }

  return (
    <section>
      <button className="link" onClick={volver}>← Mis tableros</button>
      <h1>{tablero.title}</h1>
      {error && <p className="error">{error}</p>}

      <div className="columns">
        {tablero.columns.map((columna) => (
          <div
            key={columna.id}
            className="column"
            onDragOver={(e) => e.preventDefault()} // necesario para poder soltar aquí
            onDrop={() => soltarEn(columna.id)}
          >
            <div className="column-header">
              <h2>
                {columna.title} <span className="count">{columna.tasks.length}</span>
              </h2>
              <button className="icon-btn" title="Borrar columna" onClick={() => quitarColumna(columna)}>
                ×
              </button>
            </div>

            <div className="tasks">
              {columna.tasks.map((tarea) => (
                <article
                  key={tarea.id}
                  className="task"
                  draggable
                  onDragStart={() => setTareaArrastrada(tarea.id)}
                >
                  <div className="task-top">
                    <span className={'badge badge-' + tarea.priority}>{tarea.priority}</span>
                    <button
                      className="icon-btn"
                      title="Borrar tarea"
                      onClick={() => ejecutar(() => borrarTarea(tarea.id))}
                    >
                      ×
                    </button>
                  </div>
                  <strong>{tarea.title}</strong>
                  {tarea.description && <p className="task-desc">{tarea.description}</p>}
                </article>
              ))}
            </div>

            <NuevaTarea alCrear={(titulo, prioridad) => ejecutar(() => crearTarea(columna.id, titulo, prioridad))} />
          </div>
        ))}

        <form className="column column-new" onSubmit={añadirColumna}>
          <input
            placeholder="Nueva columna"
            value={nuevaColumna}
            onChange={(e) => setNuevaColumna(e.target.value)}
          />
          <button className="btn btn-small">Añadir columna</button>
        </form>
      </div>
    </section>
  );
}

// Pequeño formulario para añadir una tarea a una columna
function NuevaTarea({ alCrear }: { alCrear: (titulo: string, prioridad: string) => void }) {
  const [titulo, setTitulo] = useState('');
  const [prioridad, setPrioridad] = useState('media');

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (titulo.trim() === '') return;
    alCrear(titulo, prioridad);
    setTitulo('');
  }

  return (
    <form className="new-task" onSubmit={enviar}>
      <input placeholder="Nueva tarea" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
      <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
        <option value="baja">Baja</option>
        <option value="media">Media</option>
        <option value="alta">Alta</option>
      </select>
      <button className="btn btn-small">Añadir</button>
    </form>
  );
}
