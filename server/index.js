import "dotenv/config";
import express from "express";

const app = express();
const port = process.env.PORT || 8787;
const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const prompt = String(req.body?.prompt || "").trim();

  if (!prompt) {
    return res.status(400).json({ error: "Please enter a prompt." });
  }

  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.includes("put_your")) {
    return res.status(500).json({
      error: "Add your real Groq API key to .env as GROQ_API_KEY.",
    });
  }

  try {
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant inside a beginner React app. Keep answers concise and practical.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      return res.status(groqResponse.status).json({
        error: data?.error?.message || "Groq returned an error.",
      });
    }

    return res.json({
      message: data.choices?.[0]?.message?.content || "No response text returned.",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Could not reach Groq. Check your internet connection and API key.",
    });
  }
});

app.listen(port, () => {
  console.log(`Groq backend running on http://127.0.0.1:${port}`);
});
