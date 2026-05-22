import { useEffect, useState } from 'react';
import api from '../services/api';
import BookForm from '../components/BookForm';

function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const loadPageData = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const [booksResponse, categoriesResponse, ageGroupsResponse] =
        await Promise.all([
          api.get('/api/books'),
          api.get('/api/categories'),
          api.get('/api/age-groups'),
        ]);

      setBooks(booksResponse.data);
      setCategories(categoriesResponse.data);
      setAgeGroups(ageGroupsResponse.data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || 'Erro ao carregar os dados administrativos.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, []);

  const resetFormState = () => {
    setEditingBook(null);
    setIsFormOpen(false);
    setFormLoading(false);
  };

  const handleCreate = async (payload) => {
    try {
      setFormLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      await api.post('/api/admin/books', payload);

      setSuccessMessage('Livro cadastrado com sucesso.');
      resetFormState();
      await loadPageData();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || 'Erro ao cadastrar livro.'
      );
      setFormLoading(false);
    }
  };

  const handleUpdate = async (payload) => {
    try {
      setFormLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      await api.put(`/api/admin/books/${editingBook.id}`, payload);

      setSuccessMessage('Livro atualizado com sucesso.');
      resetFormState();
      await loadPageData();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || 'Erro ao atualizar livro.'
      );
      setFormLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    const confirmed = window.confirm(
      'Tem certeza que deseja remover este livro?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setErrorMessage('');
      setSuccessMessage('');

      await api.delete(`/api/admin/books/${bookId}`);
      setSuccessMessage('Livro removido com sucesso.');
      await loadPageData();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || 'Erro ao remover livro.'
      );
    }
  };

  const openCreateForm = () => {
    setEditingBook(null);
    setSuccessMessage('');
    setErrorMessage('');
    setIsFormOpen(true);
  };

  const openEditForm = (book) => {
    setEditingBook(book);
    setSuccessMessage('');
    setErrorMessage('');
    setIsFormOpen(true);
  };

  return (
    <main className="container">
      <section className="admin-books-page">
        <div className="admin-books-top">
          <div>
            <span className="section-label">Painel administrativo</span>
            <h1>Gerenciar livros</h1>
            <p>
              Cadastre, edite e remova os conteúdos disponíveis na Biblioteca
              Digital Pública.
            </p>
          </div>

          <button className="primary-button" onClick={openCreateForm}>
            Adicionar livro
          </button>
        </div>

        {successMessage ? (
          <div className="admin-feedback success-feedback">{successMessage}</div>
        ) : null}

        {errorMessage ? (
          <div className="admin-feedback error-feedback">{errorMessage}</div>
        ) : null}

        {isFormOpen ? (
          <BookForm
            initialData={editingBook}
            categories={categories}
            ageGroups={ageGroups}
            onSubmit={editingBook ? handleUpdate : handleCreate}
            onCancel={resetFormState}
            loading={formLoading}
          />
        ) : null}

        {loading ? (
          <section className="loading-page">
            <p>Carregando livros...</p>
          </section>
        ) : books.length === 0 ? (
          <section className="admin-empty-state">
            <h3>Nenhum livro cadastrado</h3>
            <p>
              Clique em <strong>Adicionar livro</strong> para começar a montar o
              acervo.
            </p>
          </section>
        ) : (
          <div className="admin-books-grid">
            {books.map((book) => (
              <article key={book.id} className="admin-book-card">
                <div className="admin-book-card-top">
                  <div>
                    <span className="admin-book-id">ID #{book.id}</span>
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                  </div>

                  <span className="admin-book-age">{book.age_group}</span>
                </div>

                <div className="admin-book-meta">
                  <span>
                    <strong>PDF:</strong> {book.pdf_url ? 'Sim' : 'Não'}
                  </span>
                  <span>
                    <strong>Capa:</strong> {book.cover_url ? 'Sim' : 'Não'}
                  </span>
                  <span>
                    <strong>Audiobook:</strong> {book.audio_url ? 'Sim' : 'Não'}
                  </span>
                </div>

                <div className="admin-book-categories">
                  {book.categories?.length ? (
                    book.categories.map((category) => (
                      <span key={category.id}>{category.name}</span>
                    ))
                  ) : (
                    <span>Sem categorias</span>
                  )}
                </div>

                <div className="admin-book-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => openEditForm(book)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => handleDelete(book.id)}
                  >
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminBooks;