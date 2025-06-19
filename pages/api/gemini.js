import { GoogleGenerativeAI } from '@google/generative-ai'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message, conversationHistory } = req.body

  if (!message) {
    return res.status(400).json({ error: 'Message is required' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured' })
  }

  try {
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(AIzaSyB5PuRAPyNFm0BYMldHUL4-ta_zDF-EvIY)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Prepare chat history for context
    const history = (conversationHistory || []).map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }))

    // Send message to Gemini
    const result = await model.generateContent({
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] },
      ],
    })

    const response = result.response.text()
    res.status(200).json({ response })
  } catch (error) {
    console.error('Gemini API error:', error)
    res.status(500).json({ error: 'Failed to get AI response' })
  }
} 