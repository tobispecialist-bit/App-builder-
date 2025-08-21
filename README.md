# TOBI AI App Builder

Generate a starter app (as a zip) from a plain-English description using Google's Gemini.

## Quick Start (Local)
1. **Install Node 18+**.
2. Clone or unzip the project, then:
   ```bash
   npm install
   cp .env.example .env
   # put your Gemini key in .env
   npm run dev
   ```
3. Open http://localhost:8080 and describe the app you want.

## Deploy Free (Options)
### Replit (fastest to get a live link)
- Create a new Node.js Repl.
- Upload all files from this project.
- Add a Secret named `GEMINI_API_KEY` with your key.
- Click **Run**. Replit will give you a live web URL.

### Render (free web service)
- Push this folder to GitHub.
- Create a **Web Service** on Render → **Build Command**: `npm install` → **Start Command**: `npm start`.
- Add an environment variable `GEMINI_API_KEY`.
- Deploy to get a live link.

## Security
- **Never** hardcode your API key in the client. This app keeps it on the server only.

## How it Works
- Frontend posts your description to `/api/build`.
- The server calls Gemini (`gemini-1.5-pro`) with a strict JSON instruction.
- Response is parsed and zipped into downloadable files.

## Notes
- Outputs are lightweight starters. You may need to tweak and extend them.
- If the model returns invalid JSON, the server responds with the raw text so you can adjust the prompt and retry.
