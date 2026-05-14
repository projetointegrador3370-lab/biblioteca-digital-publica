import pool from '../config/database.js';

export const getBooks = async (req, res) => {
  try {
    const { search } = req.query;

    let query = `
      SELECT
        b.id,
        b.title,
        b.author,
        b.description,
        b.pdf_url,
        b.cover_url,
        b.created_at,
        b.age_group_id,
        ag.name AS age_group,
        a.audio_url,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', c.id,
              'name', c.name
            )
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'
        ) AS categories
      FROM books b
      JOIN age_groups ag ON b.age_group_id = ag.id
      LEFT JOIN audiobooks a ON a.book_id = b.id
      LEFT JOIN book_categories bc ON bc.book_id = b.id
      LEFT JOIN categories c ON c.id = bc.category_id
    `;

    const values = [];

    if (search) {
      query += `
        WHERE
          b.title ILIKE $1
          OR b.author ILIKE $1
          OR b.description ILIKE $1
      `;
      values.push(`%${search}%`);
    }

    query += `
      GROUP BY
        b.id,
        ag.name,
        a.audio_url
      ORDER BY b.created_at DESC
    `;

    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    res.status(500).json({
      error: 'Erro ao buscar livros.',
      details: error.message,
    });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        b.id,
        b.title,
        b.author,
        b.description,
        b.pdf_url,
        b.cover_url,
        b.created_at,
        b.age_group_id,
        ag.name AS age_group,
        a.audio_url,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', c.id,
              'name', c.name
            )
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'
        ) AS categories
      FROM books b
      JOIN age_groups ag ON b.age_group_id = ag.id
      LEFT JOIN audiobooks a ON a.book_id = b.id
      LEFT JOIN book_categories bc ON bc.book_id = b.id
      LEFT JOIN categories c ON c.id = bc.category_id
      WHERE b.id = $1
      GROUP BY
        b.id,
        ag.name,
        a.audio_url
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Livro não encontrado.',
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar livro por ID:', error);
    res.status(500).json({
      error: 'Erro ao buscar livro.',
      details: error.message,
    });
  }
};

export const createBook = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      title,
      author,
      description,
      pdf_url,
      cover_url,
      age_group_id,
      category_ids = [],
      audio_url,
    } = req.body;

    if (!title || !author || !pdf_url || !age_group_id) {
      return res.status(400).json({
        error: 'title, author, pdf_url e age_group_id são obrigatórios.',
      });
    }

    await client.query('BEGIN');

    const bookResult = await client.query(
      `
      INSERT INTO books (title, author, description, pdf_url, cover_url, age_group_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [title, author, description || null, pdf_url, cover_url || null, age_group_id]
    );

    const book = bookResult.rows[0];

    if (Array.isArray(category_ids) && category_ids.length > 0) {
      for (const categoryId of category_ids) {
        await client.query(
          `
          INSERT INTO book_categories (book_id, category_id)
          VALUES ($1, $2)
          ON CONFLICT (book_id, category_id) DO NOTHING
          `,
          [book.id, categoryId]
        );
      }
    }

    if (audio_url) {
      await client.query(
        `
        INSERT INTO audiobooks (book_id, audio_url)
        VALUES ($1, $2)
        `,
        [book.id, audio_url]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Livro criado com sucesso.',
      book,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar livro:', error);
    res.status(500).json({
      error: 'Erro ao criar livro.',
      details: error.message,
    });
  } finally {
    client.release();
  }
};

export const updateBook = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const {
      title,
      author,
      description,
      pdf_url,
      cover_url,
      age_group_id,
      category_ids = [],
      audio_url,
    } = req.body;

    if (!title || !author || !pdf_url || !age_group_id) {
      return res.status(400).json({
        error: 'title, author, pdf_url e age_group_id são obrigatórios.',
      });
    }

    const existingBook = await client.query(
      'SELECT id FROM books WHERE id = $1',
      [id]
    );

    if (existingBook.rows.length === 0) {
      return res.status(404).json({
        error: 'Livro não encontrado.',
      });
    }

    await client.query('BEGIN');

    const updatedBookResult = await client.query(
      `
      UPDATE books
      SET
        title = $1,
        author = $2,
        description = $3,
        pdf_url = $4,
        cover_url = $5,
        age_group_id = $6
      WHERE id = $7
      RETURNING *
      `,
      [title, author, description || null, pdf_url, cover_url || null, age_group_id, id]
    );

    await client.query(
      'DELETE FROM book_categories WHERE book_id = $1',
      [id]
    );

    if (Array.isArray(category_ids) && category_ids.length > 0) {
      for (const categoryId of category_ids) {
        await client.query(
          `
          INSERT INTO book_categories (book_id, category_id)
          VALUES ($1, $2)
          ON CONFLICT (book_id, category_id) DO NOTHING
          `,
          [id, categoryId]
        );
      }
    }

    const existingAudio = await client.query(
      'SELECT id FROM audiobooks WHERE book_id = $1',
      [id]
    );

    if (audio_url) {
      if (existingAudio.rows.length > 0) {
        await client.query(
          `
          UPDATE audiobooks
          SET audio_url = $1
          WHERE book_id = $2
          `,
          [audio_url, id]
        );
      } else {
        await client.query(
          `
          INSERT INTO audiobooks (book_id, audio_url)
          VALUES ($1, $2)
          `,
          [id, audio_url]
        );
      }
    } else {
      await client.query(
        'DELETE FROM audiobooks WHERE book_id = $1',
        [id]
      );
    }

    await client.query('COMMIT');

    res.status(200).json({
      message: 'Livro atualizado com sucesso.',
      book: updatedBookResult.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao atualizar livro:', error);
    res.status(500).json({
      error: 'Erro ao atualizar livro.',
      details: error.message,
    });
  } finally {
    client.release();
  }
};

export const deleteBook = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    const existingBook = await client.query(
      'SELECT id FROM books WHERE id = $1',
      [id]
    );

    if (existingBook.rows.length === 0) {
      return res.status(404).json({
        error: 'Livro não encontrado.',
      });
    }

    await client.query('BEGIN');

    await client.query('DELETE FROM books WHERE id = $1', [id]);

    await client.query('COMMIT');

    res.status(200).json({
      message: 'Livro removido com sucesso.',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao remover livro:', error);
    res.status(500).json({
      error: 'Erro ao remover livro.',
      details: error.message,
    });
  } finally {
    client.release();
  }
};