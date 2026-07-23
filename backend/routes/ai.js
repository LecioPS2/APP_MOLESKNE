const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Remove hardcoded key for security
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

router.post('/scan', async (req, res) => {
  try {
    const { image } = req.body; // Base64 image
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Strip the "data:image/jpeg;base64," prefix
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // Prepare the model
    // Using gemini-1.5-flash as it is fast and excellent at multimodal OCR
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Você é um assistente de produtividade especializado em analisar anotações manuscritas ou impressas.
Analise a imagem fornecida e extraia as informações estruturadas no formato JSON abaixo.

Regras de Classificação de Categoria:
- Se mencionar reuniões, discussões com clientes ou planejamento, classifique como "Reunião"
- Se mencionar inspeções, visitas a obras, análise de campo, classifique como "Visita Técnica"
- Caso contrário, classifique como "Anotação" (ou "Rascunho" se parecer muito informal)

Extraia os seguintes campos com precisão. Se não encontrar um campo, retorne string vazia "".
A data deve estar no formato YYYY-MM-DDTHH:mm. Se não houver horário, use T12:00. Se o ano não for mencionado, assuma o ano atual.

Responda APENAS com um objeto JSON válido, sem markdown, sem crases.
Exemplo de formato:
{
  "category": "Reunião",
  "text": "Discussão sobre o projeto X. O orçamento foi aprovado.",
  "date": "2026-07-25T14:30",
  "location": "Sala de Reuniões principal",
  "participants": "João, Maria, Cliente Y"
}
`;

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg"
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    let textResult = response.text();
    
    // Clean up potential markdown formatting from Gemini
    textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedJson = JSON.parse(textResult);

    res.json(parsedJson);

  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

module.exports = router;
