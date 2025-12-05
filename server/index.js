const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/claude', async (req, res) => {
  try {
    console.log('📥 API 요청 받음');
    
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );
    
    console.log('✅ API 응답 성공');
    res.json(response.data);
    
  } catch (error) {
    console.error('❌ API 에러:', error.response?.data || error.message);
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data 
    });
  }
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 프록시 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
  console.log(`🔑 API 키 설정: ${process.env.ANTHROPIC_API_KEY ? '✅ 있음' : '❌ 없음'}`);
});