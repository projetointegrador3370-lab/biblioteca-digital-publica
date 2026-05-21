import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import AudioPlayer from '../components/AudioPlayer';
import PdfReader from '../components/PdfReader';
import TTSControls from '../components/TTSControls';

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [pdfText, setPdfText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/api/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error('Erro ao buscar livro:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <main className="container">
        <p className="loading-page">Carregando livro...</p>
      </main>
    );
  }

  if (!book) {
    return (
      <main className="container">
        <section className="book-details-page">
          <h2>Livro não encontrado</h2>

          <Link to="/" className="details-back-link">
            Voltar para o catálogo
          </Link>
        </section>
      </main>
    );
  }

  const categoriesText =
    book.categories && book.categories.length > 0
      ? book.categories.map((category) => category.name).join(', ')
      : 'Sem categoria';

  return (
    <main className="container">
      <section className="book-details-page">
        <Link to="/" className="details-back-link">
          ← Voltar para o catálogo
        </Link>

        <div className="book-details-layout">
          <div className="book-details-cover">
            {book.cover_url ? (
              <img src={book.cover_url} alt={`Capa do livro ${book.title}`} />
            ) : (
              <div className="book-cover-placeholder">Sem capa</div>
            )}
          </div>

          <div className="book-details-info">
            <span className="book-age">
              {book.age_group || 'Faixa etária não informada'}
            </span>

            <h1>{book.title}</h1>

            <p>
              <strong>Autor:</strong> {book.author || 'Autor não informado'}
            </p>

            <p>
              <strong>Descrição:</strong>{' '}
              {book.description || 'Descrição não cadastrada.'}
            </p>

            <p>
              <strong>Categorias:</strong> {categoriesText}
            </p>

            <div className="book-actions">
              {book.pdf_url && (
                <a
                  href={book.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="details-button-primary"
                >
                  Abrir PDF em nova guia
                </a>
              )}

              {book.audio_url && (
                <a
                  href={book.audio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="details-button-outline"
                >
                  Abrir audiobook
                </a>
              )}
            </div>
          </div>
        </div>

        {book.pdf_url ? (
          <section className="reader-section">
            <div className="reader-section-header">
              <div>
                <span className="section-label">Leitura online</span>
                <h2>Visualização do PDF</h2>
              </div>
            </div>

            <TTSControls text={pdfText} />

            <PdfReader pdfUrl={book.pdf_url} onTextExtracted={setPdfText} />
          </section>
        ) : (
          <section className="reader-section">
            <p>Este livro ainda não possui PDF cadastrado.</p>
          </section>
        )}

        <section className="reader-section">
          <AudioPlayer audioUrl={book.audio_url} />
        </section>
      </section>
    </main>
  );
}

export default BookDetails;