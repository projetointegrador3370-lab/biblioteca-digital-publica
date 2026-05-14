import { Link } from 'react-router-dom';

function BookCard({ book }) {
  if (!book) {
    return null;
  }

  const categoriesText =
    book.categories && book.categories.length > 0
      ? book.categories.map((category) => category.name).join(', ')
      : 'Sem categoria';

  return (
    <article className="book-card">
      <div className="book-cover">
        {book.cover_url ? (
          <img src={book.cover_url} alt={`Capa do livro ${book.title}`} />
        ) : (
          <div className="book-cover-placeholder">Sem capa</div>
        )}
      </div>

      <div className="book-card-content">
        <span className="book-age">
          {book.age_group || 'Faixa etária não informada'}
        </span>

        <h3>{book.title}</h3>

        <p className="book-author">
          <strong>Autor:</strong> {book.author || 'Autor não informado'}
        </p>

        <p className="book-description">
          {book.description || 'Descrição não cadastrada.'}
        </p>

        <p className="book-categories">
          <strong>Categorias:</strong> {categoriesText}
        </p>

        <Link to={`/livros/${book.id}`} className="book-card-button">
          Ver detalhes
        </Link>
      </div>
    </article>
  );
}

export default BookCard;