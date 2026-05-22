import { useEffect, useState } from 'react';
import api from '../services/api';

function BookForm({
  initialData,
  categories = [],
  ageGroups = [],
  onSubmit,
  onCancel,
  loading,
}) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    pdf_url: '',
    cover_url: '',
    age_group_id: '',
    category_ids: [],
    audio_url: '',
  });

  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        author: initialData.author || '',
        description: initialData.description || '',
        pdf_url: initialData.pdf_url || '',
        cover_url: initialData.cover_url || '',
        age_group_id: initialData.age_group_id || '',
        category_ids:
          initialData.categories?.map((category) => category.id) || [],
        audio_url: initialData.audio_url || '',
      });
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age_group_id' ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setFormData((prev) => {
      const alreadySelected = prev.category_ids.includes(categoryId);

      return {
        ...prev,
        category_ids: alreadySelected
          ? prev.category_ids.filter((id) => id !== categoryId)
          : [...prev.category_ids, categoryId],
      };
    });
  };

  const uploadFile = async (file, type) => {
    try {
      if (type === 'pdf') setUploadingPdf(true);
      if (type === 'cover') setUploadingCover(true);

      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await api.post('/api/upload', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedUrl = response.data.apiUrl;

      if (type === 'pdf') {
        setFormData((prev) => ({
          ...prev,
          pdf_url: uploadedUrl,
        }));
      }

      if (type === 'cover') {
        setFormData((prev) => ({
          ...prev,
          cover_url: uploadedUrl,
        }));
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao enviar arquivo.');
    } finally {
      setUploadingPdf(false);
      setUploadingCover(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      ...formData,
      age_group_id: Number(formData.age_group_id),
    });
  };

  return (
    <div className="book-form-wrapper">
      <form className="book-form" onSubmit={handleSubmit}>
        <div className="book-form-header">
          <div>
            <span className="section-label">Cadastro administrativo</span>
            <h2>{initialData ? 'Editar livro' : 'Novo livro'}</h2>
          </div>

          <button
            type="button"
            className="book-form-cancel-top"
            onClick={onCancel}
          >
            Fechar
          </button>
        </div>

        <div className="book-form-grid">
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Digite o título do livro"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Autor</label>
            <input
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Digite o autor"
              required
            />
          </div>

          <div className="form-group form-group-full">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva o conteúdo do livro"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Upload do PDF</label>

            <input
              type="file"
              accept="application/pdf"
              onChange={(event) => {
                const file = event.target.files[0];

                if (file) {
                  uploadFile(file, 'pdf');
                }
              }}
            />

            {uploadingPdf ? (
              <p>Enviando PDF...</p>
            ) : formData.pdf_url ? (
              <p>PDF enviado com sucesso.</p>
            ) : null}
          </div>

          <div className="form-group">
            <label>Upload da capa</label>

            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files[0];

                if (file) {
                  uploadFile(file, 'cover');
                }
              }}
            />

            {uploadingCover ? (
              <p>Enviando capa...</p>
            ) : formData.cover_url ? (
              <p>Capa enviada com sucesso.</p>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="audio_url">Link do audiobook</label>

            <input
              id="audio_url"
              name="audio_url"
              value={formData.audio_url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="age_group_id">Faixa etária</label>

            <select
              id="age_group_id"
              name="age_group_id"
              value={formData.age_group_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecione</option>

              {ageGroups.map((ageGroup) => (
                <option key={ageGroup.id} value={ageGroup.id}>
                  {ageGroup.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group form-group-full">
            <label>Categorias</label>

            <div className="category-checkbox-grid">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="category-checkbox-item"
                >
                  <input
                    type="checkbox"
                    checked={formData.category_ids.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                  />

                  <span>{category.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="book-form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={loading || uploadingPdf || uploadingCover}
          >
            {loading
              ? initialData
                ? 'Salvando...'
                : 'Cadastrando...'
              : initialData
              ? 'Salvar alterações'
              : 'Cadastrar livro'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookForm;