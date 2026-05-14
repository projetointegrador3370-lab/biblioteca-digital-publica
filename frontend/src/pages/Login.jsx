import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest, getCurrentUser } from '../services/auth';

function Login({ setAuthUser }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      await loginRequest(formData.email, formData.password);
      const currentUserResponse = await getCurrentUser();

      setAuthUser(currentUserResponse.user);
      navigate('/');
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || 'Não foi possível realizar o login.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <section className="login-page">
        <div className="login-card">
          <span className="section-label">Área administrativa</span>
          <h2>Entrar no sistema</h2>
          <p>
            Faça login com seu usuário administrador para acessar o painel e gerenciar
            os conteúdos da biblioteca.
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="admin@biblioteca.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {errorMessage ? (
              <div className="form-error">{errorMessage}</div>
            ) : null}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="login-tip">
            <strong>Usuário atual de teste:</strong>
            <span>admin@biblioteca.com</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;