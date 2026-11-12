import type { ReactElement } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth';
import Login from './pages/Login';
import Boards from './pages/Boards';
import BoardPage from './pages/BoardPage';

function RequireAuth({ children }: { children: ReactElement }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user, logout } = useAuth();

  return (
    <>
      <header className="topbar">
        <Link to="/" className="brand">
          Kanban
        </Link>
        {user && (
          <div className="topbar-right">
            <span>Hola, {user.name}</span>
            <button className="btn btn-ghost" onClick={logout}>
              Salir
            </button>
          </div>
        )}
      </header>

      <main className="container">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Boards />
              </RequireAuth>
            }
          />
          <Route
            path="/boards/:id"
            element={
              <RequireAuth>
                <BoardPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
