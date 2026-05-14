import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CREDENTIALS_PATH = path.join(__dirname, '../../config/credentials.json');
const TOKEN_PATH = path.join(__dirname, '../../config/token.json');

const FOLDER_ID = '1S2-fMxzHR6erTpY0t-i3YYuRLDcen1Jb';

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
const token = JSON.parse(fs.readFileSync(TOKEN_PATH));

const { client_id, client_secret, redirect_uris } = credentials.installed;

const auth = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

auth.setCredentials(token);

const drive = google.drive({
  version: 'v3',
  auth,
});

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
      fields: 'id, name, mimeType, webViewLink, webContentLink',
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
      apiUrl: `http://localhost:3001/api/files/${fileId}`,
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