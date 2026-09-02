import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'photocliqa_user',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'photocliqa_db',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return { success: true, message: 'Conexão com MySQL estabelecida com sucesso' };
  } catch (error) {
    return { success: false, message: `Erro na conexão: ${error.message}` };
  }
}

export default pool;