import { Link } from 'react-router-dom';

function AdminDashboard({ authUser }) {
  return (
    <main className="container">
      <section className="admin-page">
        <div className="admin-header">
          <span className="section-label">Painel administrativo</span>
          <h1>Gerenciamento da Biblioteca</h1>
          <p>
            Área restrita para administração dos conteúdos da plataforma. Aqui você
            poderá cadastrar, editar e remover livros, capas, PDFs, links e
            audiolivros.
          </p>
        </div>

        <div className="admin-grid">
          <article className="admin-card">
            <h3>Livros</h3>
            <p>
              Cadastre novos livros e organize os conteúdos disponíveis para leitura.
            </p>
            <Link to="/admin/livros" className="admin-card-button">
              Gerenciar livros
            </Link>
          </article>

          <article className="admin-card">
            <h3>Usuário logado</h3>
            <p>Controle atual do painel administrativo.</p>
            <div className="admin-user-box">
              <strong>{authUser?.email}</strong>
              <span>Perfil: {authUser?.role}</span>
            </div>
          </article>

          <article className="admin-card">
            <h3>Status do sistema</h3>
            <p>
              Backend autenticado, rotas protegidas e integração com banco funcionando.
            </p>
            <div className="admin-status">
              <span>API protegida</span>
              <span>JWT ativo</span>
              <span>CRUD backend pronto</span>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;