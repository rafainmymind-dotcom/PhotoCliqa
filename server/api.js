import express from 'express';
import { testConnection } from './db.js';

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

// Endpoint para verificar o status da API
router.get('/status', (req, res) => {
  res.json({ 
    status: 'online', 
    timestamp: new Date().toISOString(),
    message: 'API PhotoCliqa funcionando' 
  });
});

export default router;