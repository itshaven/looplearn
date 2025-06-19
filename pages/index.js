import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect to chat if user is already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/chat')
    }
  }, [status, router])

  const handleGetStarted = () => {
    if (session) {
      router.push('/chat')
    } else {
      signIn('google')
    }
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

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">LoopLearn</div>
            <div>
              {session ? (
                <button 
                  className="btn btn-primary"
                  onClick={() => router.push('/chat')}
                >
                  Go to Chat
                </button>
              ) : (
                <button 
                  className="btn btn-primary"
                  onClick={() => signIn('google')}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            marginBottom: '1rem',
            color: '#1e293b'
          }}>
            Welcome to LoopLearn
          </h1>
          
          <p style={{ 
            fontSize: '1.25rem', 
            marginBottom: '2rem',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Your AI-powered coding tutor that helps you learn programming through 
            interactive conversations. Ask questions, get explanations, and improve 
            your coding skills with the help of advanced AI.
          </p>

          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              marginBottom: '1rem',
              color: '#374151'
            }}>
              Features:
            </h2>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <li style={{ 
                padding: '1rem', 
                background: '#f1f5f9', 
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}>
                🤖 AI-Powered Responses
              </li>
              <li style={{ 
                padding: '1rem', 
                background: '#f1f5f9', 
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}>
                💬 Interactive Chat Interface
              </li>
              <li style={{ 
                padding: '1rem', 
                background: '#f1f5f9', 
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}>
                🔐 Secure Authentication
              </li>
              <li style={{ 
                padding: '1rem', 
                background: '#f1f5f9', 
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}>
                📚 Learn Any Programming Language
              </li>
            </ul>
          </div>

          <button 
            className="btn btn-primary"
            onClick={handleGetStarted}
            style={{ 
              fontSize: '1.25rem', 
              padding: '1rem 2rem',
              marginTop: '1rem'
            }}
          >
            {session ? 'Continue to Chat' : 'Get Started with Google'}
          </button>

          {!session && (
            <p style={{ 
              marginTop: '1rem', 
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Sign in with your Google account to start learning
            </p>
          )}
        </div>
      </main>
    </div>
  )
} 