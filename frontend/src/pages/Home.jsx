import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import BookCard from '../components/BookCard';

function Home() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();

  const categoriaFiltro = searchParams.get('categoria');
  const idadeFiltro = searchParams.get('idade');

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [books, categoriaFiltro, idadeFiltro]);

  const fetchBooks = async (searchValue = '') => {
    try {
      const response = await api.get('/api/books', {
        params: searchValue ? { search: searchValue } : {},
      });

      setBooks(response.data);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
    }
  };

  const applyFilters = () => {
    let result = [...books];

    if (categoriaFiltro) {
      result = result.filter((book) =>
        book.categories?.some(
          (category) =>
            category.name.toLowerCase() === categoriaFiltro.toLowerCase()
        )
      );
    }

    if (idadeFiltro) {
      result = result.filter(
        (book) =>
          book.age_group &&
          book.age_group.toLowerCase() === idadeFiltro.toLowerCase()
      );
    }

    setFilteredBooks(result);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(search);
  };

  return (
    <main className="container">
      <section className="hero-home">
        <div className="hero-text">
          <span className="hero-label">Biblioteca Digital</span>

          <h1>
            Descubra novos livros, leia online e aproveite recursos de
            acessibilidade
          </h1>

          <p>
            Encontre títulos por autor ou nome da obra, explore categorias e
            tenha acesso a uma experiência de leitura simples, prática e
            organizada.
          </p>

          <div className="hero-actions">
            <a href="#catalogo" className="btn-primary">
              Explorar livros
            </a>

            <Link to="/categorias" className="btn-outline">
              Ver categorias
            </Link>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-panel-card">
            <strong>Leitura online</strong>
            <span>Acesse livros digitais em um só lugar</span>
          </div>

          <div className="hero-panel-card">
            <strong>Audiobooks</strong>
            <span>Ouça conteúdos com mais praticidade</span>
          </div>

          <div className="hero-panel-card">
            <strong>Busca rápida</strong>
            <span>Pesquise por título ou autor</span>
          </div>
        </div>
      </section>

      <section className="highlights">
        <article className="highlight-card">
          <h3>Leitura fácil</h3>

          <p>
            Navegue pelo acervo e encontre livros de forma rápida e organizada.
          </p>
        </article>

        <article className="highlight-card">
          <h3>Acesso em qualquer momento</h3>

          <p>
            Consulte o catálogo digital sempre que quiser, com praticidade.
          </p>
        </article>

        <article className="highlight-card">
          <h3>Mais acessibilidade</h3>

          <p>
            Utilize recursos como audiobooks para tornar a experiência mais
            inclusiva.
          </p>
        </article>
      </section>

      <section id="catalogo" className="catalog-section">
        <div className="section-top">
          <div>
            <span className="section-label">Acervo digital</span>

            <h2>Catálogo da Biblioteca</h2>

            {categoriaFiltro && (
              <p>
                Filtrando por categoria: <strong>{categoriaFiltro}</strong>
              </p>
            )}

            {idadeFiltro && (
              <p>
                Filtrando por faixa etária: <strong>{idadeFiltro}</strong>
              </p>
            )}

            {!categoriaFiltro && !idadeFiltro && (
              <p>
                Pesquise livros disponíveis e encontre o conteúdo que deseja
                ler.
              </p>
            )}
          </div>

          <div className="counter-box">
            <strong>{filteredBooks.length}</strong>
            <span>livros encontrados</span>
          </div>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Digite o título ou o autor do livro"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit">Buscar</button>
        </form>

        {(categoriaFiltro || idadeFiltro) && (
          <Link to="/" className="btn-outline">
            Limpar filtro
          </Link>
        )}

        <section className="books-grid">
          {filteredBooks.length === 0 ? (
            <div className="empty-state">
              <h3>Nenhum livro encontrado</h3>

              <p>
                Tente realizar uma nova busca ou escolha outra categoria/faixa
                etária.
              </p>
            </div>
          ) : (
            filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))
          )}
        </section>
      </section>
    </main>
  );
}

export default Home;