import { getFileStream } from '../services/googleDriveService.js';

export async function getDriveFile(req, res) {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return res.status(400).json({
        error: 'ID do arquivo não informado.',
      });
    }

    const { metadata, stream } = await getFileStream(fileId);

    res.setHeader('Content-Type', metadata.mimeType);
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(metadata.name)}"`
    );

    stream.on('error', (error) => {
      console.error('Erro no stream do arquivo:', error);
      if (!res.headersSent) {
        res.status(500).json({
          error: 'Erro ao carregar arquivo.',
        });
      }
    });

    stream.pipe(res);
  } catch (error) {
    console.error('Erro ao buscar arquivo do Drive:', error);
    res.status(500).json({
      error: 'Erro ao buscar arquivo do Drive.',
      details: error.message,
    });
  }
}