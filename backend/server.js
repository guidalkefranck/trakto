import app from './app.js';
import validarAmbiente from './config/ambiente.js';
import pool from './database/conexao.js';

try {
  validarAmbiente();
  const porta = Number(process.env.PORT || 3000);

  // 0.0.0.0 aceita conexões da rede local: o celular com Expo Go consegue chamar a API.
  const servidor = app.listen(porta, '0.0.0.0', async function iniciar() {
    console.log('🚜 API TRAKTO rodando em http://localhost:' + porta);
    try {
      await pool.query('SELECT 1');
      console.log('✅ Conectada ao MySQL (banco "' + process.env.DB_NAME + '").');
    } catch (erro) {
      console.error('⚠️  Não foi possível conectar ao MySQL: ' + (erro.code || erro.message));
      console.error('   Confira se o MySQL está ligado, se database/trakto.sql foi executado e os dados de backend/.env.');
    }
  });

  servidor.on('error', function erroServidor(erro) {
    console.error(erro.code === 'EADDRINUSE' ? 'A porta ' + porta + ' já está em uso.' : 'Não foi possível iniciar a API.');
    process.exitCode = 1;
  });
} catch (erro) {
  console.error(erro.message);
  process.exitCode = 1;
}
