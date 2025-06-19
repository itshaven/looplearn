# LoopLearn

LoopLearn is an AI-powered coding tutor built with Next.js. It features Google OAuth authentication, a protected chat interface, and AI answers powered by Gemini (Google Generative AI).

## Features
- Landing page with welcome message and sign-in
- Protected chat page (only for signed-in users)
- Google OAuth authentication (NextAuth.js)
- AI-powered answers via Gemini API
- Clean, modern UI

## Getting Started

### 1. Clone the repository
```
git clone <your-repo-url>
cd looplearn
```

### 2. Install dependencies
```
npm install
```

### 3. Configure environment variables
Copy the example file and fill in your credentials:
```
cp env.example .env.local
```
Edit `.env.local` and set:
- `NEXTAUTH_URL` — usually `http://localhost:3000` for local dev
- `NEXTAUTH_SECRET` — generate a random string (e.g. `openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` — see below
- `GEMINI_API_KEY` — your Google Generative AI API key

#### How to get Google OAuth credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project (or select an existing one)
3. Go to **OAuth consent screen** and configure it
4. Go to **Credentials** > **Create Credentials** > **OAuth client ID**
5. Choose **Web application**
6. Set **Authorized redirect URIs** to:
   - `http://localhost:3000/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret** into your `.env.local`

#### How to get a Gemini API key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create an API key and paste it as `GEMINI_API_KEY` in your `.env.local`

### 4. Run the app
```
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `pages/index.js` — Landing page
- `pages/chat.js` — Protected chat page
- `pages/api/auth/[...nextauth].js` — NextAuth API route
- `pages/api/gemini.js` — Gemini AI API route
- `styles/globals.css` — Global styles

## License
MIT 