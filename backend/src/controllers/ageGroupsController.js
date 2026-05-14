import pool from '../config/database.js';

export const getAgeGroups = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, min_age, max_age
      FROM age_groups
      ORDER BY id ASC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar faixas etárias:', error);

    res.status(500).json({
      error: 'Erro ao buscar faixas etárias.',
      details: error.message,
    });
  }
};