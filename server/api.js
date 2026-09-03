import express from 'express';
import { testConnection } from './db.js';
import pool from './db.js';

const router = express.Router();

// Endpoint para testar conexão com o banco
router.get('/test-connection', async (req, res) => {
  try {
    const result = await testConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: `Erro no endpoint: ${error.message}` 
    });
  }
});

// Endpoint para testar uma consulta SQL simples
router.get('/test-query', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT 1 as test, NOW() as timestamp');
    connection.release();
    res.json({ 
      success: true, 
      message: 'Consulta SQL executada com sucesso',
      result: rows 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: `Erro na consulta: ${error.message}` 
    });
  }
});

// Endpoint para verificar o status da API
router.get('/status', (req, res) => {
  res.json({ 
    status: 'online', 
    timestamp: new Date().toISOString(),
    message: 'API PhotoCliqa funcionando' 
  });
});

export default router;