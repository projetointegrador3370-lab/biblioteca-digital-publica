import { uploadFile } from '../services/googleDriveService.js';

export async function upload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const result = await uploadFile(req.file);

    res.json(result);
  } catch (error) {
    console.error('Erro ao enviar arquivo:', error);
    res.status(500).json({ error: 'Erro ao enviar arquivo' });
  }
}