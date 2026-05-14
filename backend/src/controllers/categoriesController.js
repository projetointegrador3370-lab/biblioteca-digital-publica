import pool from '../config/database.js';

export const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name FROM categories ORDER BY name ASC'
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);

    res.status(500).json({
      error: 'Erro ao buscar categorias.',
      details: error.message,
    });
  }
};