import { useState } from 'react';
import { iniciarSesion, registrar } from '../api';
import type { Usuario } from '../types';

interface Props {
  alEntrar: (token: string, usuario: Usuario) => void;
}

// Pantalla de login y registro (el mismo formulario sirve para las dos cosas)
export default function Login({ alEntrar }: Props) {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  async function enviar(e: React.FormEvent) {
    e.preventDefault(); // evita que la página se recargue
    setError('');

    try {
      const datos = modoRegistro
        ? await registrar(nombre, email, clave)
        : await iniciarSesion(email, clave);
      alEntrar(datos.token, datos.user);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="auth-card">
      <h1>{modoRegistro ? 'Crear cuenta' : 'Iniciar sesión'}</h1>

      <form className="form" onSubmit={enviar}>
        {modoRegistro && (
          <label>
            Nombre
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </label>
        )}
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Contraseña
          <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} required />
        </label>
        {modoRegistro && <small className="hint">Mínimo 8 caracteres</small>}

        {error && <p className="error">{error}</p>}

        <button className="btn">{modoRegistro ? 'Registrarme' : 'Entrar'}</button>
      </form>

      <p className="switch">
        {modoRegistro ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
        <button className="link" type="button" onClick={() => setModoRegistro(!modoRegistro)}>
          {modoRegistro ? 'Inicia sesión' : 'Regístrate'}
        </button>
      </p>
    </div>
  );
}
