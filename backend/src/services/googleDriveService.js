import { google } from 'googleapis';
import fs from 'fs';

const FOLDER_ID = '1S2-fMxzHR6erTpY0t-i3YYuRLDcen1Jb';

function loadGoogleCredentials() {
  if (process.env.GOOGLE_CREDENTIALS_JSON) {
    return JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
  }

  if (fs.existsSync('./config/credentials.json')) {
    return JSON.parse(fs.readFileSync('./config/credentials.json', 'utf8'));
  }

  throw new Error(
    'Credenciais do Google Drive não encontradas. Configure GOOGLE_CREDENTIALS_JSON no Render ou backend/config/credentials.json localmente.'
  );
}

const credentials = loadGoogleCredentials();

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({
  version: 'v3',
  auth,
});

function getApiBaseUrl() {
  return process.env.API_BASE_URL || 'http://localhost:3001';
}

export async function uploadFile(file) {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: file.originalname,
        parents: [FOLDER_ID],
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      },
      fields: 'id, name, mimeType',
      supportsAllDrives: true,
    });

    const fileId = response.data.id;

    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
      supportsAllDrives: true,
    });

    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    return {
      id: fileId,
      name: response.data.name,
      mimeType: response.data.mimeType,
      viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
      directUrl: `https://drive.google.com/uc?export=view&id=${fileId}`,
      apiUrl: `${getApiBaseUrl()}/api/files/${fileId}`,
    };
  } catch (error) {
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    console.error('Erro no Google Drive:', error);
    throw error;
  }
}

export async function getFileStream(fileId) {
  try {
    const metadataResponse = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType',
      supportsAllDrives: true,
    });

    const fileResponse = await drive.files.get(
      {
        fileId,
        alt: 'media',
        supportsAllDrives: true,
      },
      {
        responseType: 'stream',
      }
    );

    return {
      metadata: metadataResponse.data,
      stream: fileResponse.data,
    };
  } catch (error) {
    console.error('Erro ao buscar arquivo no Google Drive:', error);
    throw error;
  }
}