import '../config/ambiente.js';
import mysql from 'mysql2/promise';

// Pool: reaproveita conexões abertas em vez de abrir uma nova a cada requisição.
// As credenciais vêm do backend/.env, nunca do código-fonte.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  decimalNumbers: true, // DECIMAL chega como número (150.00 → 150), não como texto
  dateStrings: true,    // DATE chega como '2026-11-10', sem conversão de fuso horário
});

export default pool;
