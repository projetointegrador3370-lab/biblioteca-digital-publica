import { google } from 'googleapis';
import fs from 'fs';
import readline from 'readline';

const CREDENTIALS_PATH = './config/credentials.json';
const TOKEN_PATH = './config/token.json';

const SCOPES = ['https://www.googleapis.com/auth/drive'];

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
const { client_id, client_secret, redirect_uris } = credentials.installed;

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: SCOPES,
});

console.log('\nAbra este link no navegador:\n');
console.log(authUrl);
console.log('\nDepois cole aqui o código gerado pelo Google.\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Cole o código aqui: ', async (code) => {
  try {
    const cleanCode = code.trim();

    const { tokens } = await oauth2Client.getToken(cleanCode);

    oauth2Client.setCredentials(tokens);

    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));

    console.log('\nToken salvo com sucesso em config/token.json');
  } catch (error) {
    console.error('\nErro ao gerar token:', error.response?.data || error.message);
  } finally {
    rl.close();
  }
});