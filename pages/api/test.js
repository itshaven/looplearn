import { GoogleGenerativeAI } from '@google/generative-ai'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured' })
  }

  try {
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Send a simple test message
    const result = await model.generateContent('Hello! Please respond with "API is working correctly!" if you can see this message.')
    const response = result.response.text()
    
    res.status(200).json({ 
      success: true, 
      message: 'API key is working!',
      response: response 
    })
  } catch (error) {
    console.error('Gemini API test error:', error)
    res.status(500).json({ 
      error: 'Failed to test Gemini API',
      details: error.message 
    })
  }
} 