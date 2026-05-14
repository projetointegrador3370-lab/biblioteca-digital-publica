import { Link, useNavigate } from 'react-router-dom';

function Navbar({ authUser, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand-title">
          Biblioteca Digital Pública
        </Link>

        <div className="nav-links">
          <Link to="/">Início</Link>
          <Link to="/categorias">Categorias</Link>

          {authUser?.role === 'admin' ? (
            <Link to="/admin" className="nav-admin-link">
              Painel Admin
            </Link>
          ) : null}

          {authUser ? (
            <>
              <span className="nav-user-badge">
                {authUser.email}
              </span>

              <button type="button" className="nav-button" onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-button">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;