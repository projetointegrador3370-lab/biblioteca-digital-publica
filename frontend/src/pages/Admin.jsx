import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    pdf_url: ""
  });

  const API = "http://localhost:3000/api/books";

  // Buscar livros
  async function fetchBooks() {
    const res = await axios.get(API);
    setBooks(res.data);
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  // Criar livro
  async function handleSubmit(e) {
    e.preventDefault();
    await axios.post(API, form);
    setForm({ title: "", author: "", description: "", pdf_url: "" });
    fetchBooks();
  }

  // Deletar livro
  async function handleDelete(id) {
    await axios.delete(`${API}/${id}`);
    fetchBooks();
  }

  return (
    <div className="admin-container">
      <h1>Painel Administrativo</h1>

      {/* FORMULÁRIO */}
      <form onSubmit={handleSubmit} className="admin-form">
        <input
          placeholder="Título"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Autor"
          value={form.author}
          onChange={e => setForm({ ...form, author: e.target.value })}
        />
        <input
          placeholder="Link do PDF"
          value={form.pdf_url}
          onChange={e => setForm({ ...form, pdf_url: e.target.value })}
        />
        <textarea
          placeholder="Descrição"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <button type="submit">Cadastrar Livro</button>
      </form>

      {/* LISTA */}
      <div className="book-list">
        {books.map(book => (
          <div key={book.id} className="book-card">
            <h3>{book.title}</h3>
            <p>{book.author}</p>

            <button onClick={() => handleDelete(book.id)}>
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}