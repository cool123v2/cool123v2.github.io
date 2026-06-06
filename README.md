# AI React Template

A lightweight Vite + React starter with an AI assistant-style interface.

## Start

```bash
npm install
npm run dev
```

Then open the local URL Vite prints in your terminal. The React app runs through Vite, and the Groq backend runs on `http://127.0.0.1:8787`.

## Groq API Key

Put your Groq API key in `.env`:

```env
GROQ_API_KEY=your_real_groq_api_key_here
```

Do not put the key in React files. Frontend code is visible in the browser, so the key should only be used from a backend endpoint.

You can optionally set a model:

```env
GROQ_MODEL=llama-3.1-8b-instant
```

## Files

- `src/main.jsx` contains the React app.
- `src/styles.css` contains the layout and visual design.
- `package.json` contains the scripts and dependencies.

## Next Ideas

- Add state to make the prompt input append messages.
- Connect the form to an AI API endpoint.
- Split the UI into reusable components.
