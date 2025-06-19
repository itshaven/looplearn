import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'

export default function Chat() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef(null)

  // Redirect to home if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Add welcome message when user first visits
  useEffect(() => {
    if (status === 'authenticated' && messages.length === 0) {
      setMessages([
        {
          id: 1,
          content: `Hello ${session?.user?.name || 'there'}! 👋 I'm your AI coding tutor. Ask me anything about programming, and I'll help you learn and improve your coding skills. You can ask about specific languages, concepts, debugging help, or request code examples.`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString()
        }
      ])
    }
  }, [status, session, messages.length])

  const sendMessage = async (e) => {
    e.preventDefault()
    
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory: messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from AI')
      }

      const data = await response.json()
      
      const aiMessage = {
        id: Date.now() + 1,
        content: data.response,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage = {
        id: Date.now() + 1,
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  // Show loading while checking authentication status
  if (status === 'loading') {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">LoopLearn</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {session?.user?.image && (
                <img 
                  src={session.user.image} 
                  alt={session.user.name}
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%' 
                  }}
                />
              )}
              <span style={{ color: '#374151' }}>
                Welcome, {session?.user?.name}
              </span>
              <button 
                className="btn btn-secondary"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <main className="container">
        <div className="card">
          <h1 style={{ marginBottom: '1rem', color: '#1e293b' }}>
            AI Coding Tutor Chat
          </h1>
          
          {/* Messages Container */}
          <div 
            ref={chatContainerRef}
            className="chat-container"
          >
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender}`}
              >
                <div className="message-content">
                  {message.content}
                </div>
                <div className="message-time">
                  {message.timestamp}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message ai">
                <div className="message-content" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="spinner"></div>
                  Thinking...
                </div>
                <div className="message-time">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>

          {/* Message Input Form */}
          <form onSubmit={sendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about programming..."
              className="form-input"
              style={{ flex: 1 }}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading || !inputMessage.trim()}
            >
              Send
            </button>
          </form>

          {/* Tips */}
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            background: '#f8fafc', 
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#374151' }}>
              💡 Tips for better learning:
            </h3>
            <ul style={{ 
              margin: 0, 
              paddingLeft: '1.5rem', 
              color: '#64748b',
              fontSize: '0.875rem'
            }}>
              <li>Be specific with your questions</li>
              <li>Ask for code examples when needed</li>
              <li>Request explanations of concepts you don't understand</li>
              <li>Ask for debugging help with error messages</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
} 