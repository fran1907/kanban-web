import { useCallback, useEffect, useRef, useState, type DragEvent, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import type { Board, Column, Priority } from '../types';

interface DragInfo {
  taskId: number;
  fromColumnId: number;
  fromIndex: number;
}

export default function BoardPage() {
  const { id } = useParams();
  const boardId = Number(id);
  const [board, setBoard] = useState<Board | null>(null);
  const [error, setError] = useState('');
  const [newColumn, setNewColumn] = useState('');
  const [overColumn, setOverColumn] = useState<number | null>(null);
  const dragRef = useRef<DragInfo | null>(null);

  const fail = (err: unknown) => setError(err instanceof Error ? err.message : 'Error inesperado');

  const load = useCallback(async () => {
    try {
      setBoard(await api.getBoard(boardId));
      setError('');
    } catch (err) {
      fail(err);
    }
  }, [boardId]);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (action: () => Promise<unknown>) => {
    try {
      await action();
      await load();
    } catch (err) {
      fail(err);
    }
  };

  const onAddColumn = (e: FormEvent) => {
    e.preventDefault();
    if (!newColumn.trim()) return;
    run(() => api.addColumn(boardId, newColumn.trim()));
    setNewColumn('');
  };

  const onDeleteColumn = (col: Column) => {
    if (!confirm(`¿Borrar la columna "${col.title}" y sus tareas?`)) return;
    run(() => api.deleteColumn(col.id));
  };

  // Soltar una tarea en una columna. `index` es la posición de la tarjeta sobre la que se suelta,
  // o null si se suelta en el hueco de la columna (al final).
  const onDrop = (columnId: number, index: number | null) => {
    const drag = dragRef.current;
    dragRef.current = null;
    setOverColumn(null);
    if (!drag || !board) return;

    const target = board.columns.find((c) => c.id === columnId);
    if (!target) return;

    const sameColumn = drag.fromColumnId === columnId;
    let position = index ?? (sameColumn ? target.tasks.length - 1 : target.tasks.length);
    if (index !== null && sameColumn && drag.fromIndex < index) position = index - 1;
    if (sameColumn && position === drag.fromIndex) return;

    run(() => api.moveTask(drag.taskId, columnId, position));
  };

  if (!board) {
    return (
      <section>
        <Link to="/" className="back">
          ← Volver
        </Link>
        {error ? <p className="error">{error}</p> : <p>Cargando…</p>}
      </section>
    );
  }

  return (
    <section>
      <Link to="/" className="back">
        ← Mis tableros
      </Link>
      <h1>{board.title}</h1>
      {error && <p className="error">{error}</p>}

      <div className="columns">
        {board.columns.map((col) => (
          <div
            key={col.id}
            className={`column ${overColumn === col.id ? 'column-over' : ''}`}
            onDragOver={(e: DragEvent) => {
              e.preventDefault();
              setOverColumn(col.id);
            }}
            onDragLeave={() => setOverColumn((c) => (c === col.id ? null : c))}
            onDrop={(e: DragEvent) => {
              e.preventDefault();
              onDrop(col.id, null);
            }}
          >
            <div className="column-header">
              <h2>
                {col.title} <span className="count">{col.tasks.length}</span>
              </h2>
              <button className="icon-btn" title="Borrar columna" onClick={() => onDeleteColumn(col)}>
                ×
              </button>
            </div>

            <div className="tasks">
              {col.tasks.map((task, index) => (
                <article
                  key={task.id}
                  className="task"
                  draggable
                  onDragStart={() => {
                    dragRef.current = { taskId: task.id, fromColumnId: col.id, fromIndex: index };
                  }}
                  onDragOver={(e: DragEvent) => e.preventDefault()}
                  onDrop={(e: DragEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDrop(col.id, index);
                  }}
                >
                  <div className="task-top">
                    <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                    <button className="icon-btn" title="Borrar tarea" onClick={() => run(() => api.deleteTask(task.id))}>
                      ×
                    </button>
                  </div>
                  <strong>{task.title}</strong>
                  {task.description && <p className="task-desc">{task.description}</p>}
                  {task.due_date && <small className="muted">Vence: {task.due_date}</small>}
                </article>
              ))}
            </div>

            <NewTaskForm onAdd={(title, priority) => run(() => api.addTask(col.id, title, priority))} />
          </div>
        ))}

        <form className="column column-new" onSubmit={onAddColumn}>
          <input placeholder="Nueva columna" value={newColumn} onChange={(e) => setNewColumn(e.target.value)} />
          <button className="btn btn-small">Añadir columna</button>
        </form>
      </div>
    </section>
  );
}

function NewTaskForm({ onAdd }: { onAdd: (title: string, priority: Priority) => void }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('media');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), priority);
    setTitle('');
  };

  return (
    <form className="new-task" onSubmit={submit}>
      <input placeholder="Nueva tarea" value={title} onChange={(e) => setTitle(e.target.value)} />
      <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
        <option value="baja">Baja</option>
        <option value="media">Media</option>
        <option value="alta">Alta</option>
      </select>
      <button className="btn btn-small">Añadir</button>
    </form>
  );
}
