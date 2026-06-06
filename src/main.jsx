import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import ReactMarkdown from "react-markdown";
import { Bot, MessageSquare, Send, Sparkles, Wand2, Trash2 } from "lucide-react";
import "./styles.css";

const STORAGE_KEY = "ai-app-messages";

const examplePrompts = [
  "Summarize this meeting into action items",
  "Draft a friendly support reply",
  "Turn notes into a project plan",
  "What should make my app idea stand out?",
];

const INITIAL_MESSAGES = [
  {
    role: "assistant",
    content: "I am your personal assistant. How can I help you today?",
  },
];

function App() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  async function handleSubmit(event) {
    event.preventDefault();

    const cleanPrompt = prompt.trim();
    if (!cleanPrompt || isLoading) {
      return;
    }

    setPrompt("");
    setError("");
    setIsLoading(true);
    setMessages((current) => [...current, { role: "user", content: cleanPrompt }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: cleanPrompt }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "The AI request failed.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.message },
      ]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleClearChat() {
    if (confirm("Are you sure you want to clear the chat history?")) {
      setMessages(INITIAL_MESSAGES);
    }
  }

  function useExamplePrompt(examplePrompt) {
    setPrompt(examplePrompt);
    setError("");
  }

  function handlePromptKeyDown(event) {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <main className="app-shell">
      <section className="workspace">
        <aside className="sidebar" aria-label="AI tools">
          <div className="brand">
            <div className="brand-mark">
              <Bot size={22} aria-hidden="true" />
            </div>
            <div>
              <p>Made For Coding</p>
              <p className="eyebrow">Starter</p>
              <h1>Dev's AI</h1>
            </div>
          </div>

          <nav className="tool-list" aria-label="Template sections">
            <button className="tool active" type="button">
              <MessageSquare size={18} aria-hidden="true" />
              Chat
            </button>
            <button className="tool" type="button">
              <Wand2 size={18} aria-hidden="true" />
              Prompts
            </button>
            <button className="tool" type="button">
              <Sparkles size={18} aria-hidden="true" />
              Outputs
            </button>
          </nav>
        </aside>

        <section className="panel" aria-label="AI chat template">
          <header className="panel-header">
            <div>
              <p className="eyebrow">React + Vite</p>
              <h2>Build your AI app from here</h2>
            </div>
            <div className="header-actions">
              <button
                className="clear-btn"
                type="button"
                onClick={handleClearChat}
                title="Clear chat"
              >
                <Trash2 size={16} aria-hidden="true" />
                Clear
              </button>
              <span className="status">{isLoading ? "Thinking" : "Ready"}</span>
            </div>
          </header>

          <div className="chat-window">
            {messages.map((message, index) => (
              <article className={`message ${message.role}`} key={`${message.role}-${index}`}>
                {message.role === "assistant" && <Bot size={18} aria-hidden="true" />}
                <div className="message-content">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </article>
            ))}
            {isLoading && (
              <article className="message assistant">
                <Bot size={18} aria-hidden="true" />
                <p>Thinking...</p>
              </article>
            )}
          </div>

          <div className="prompt-row" aria-label="Example prompts">
            {examplePrompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => useExamplePrompt(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          {error && <p className="error-message">{error}</p>}

          <form className="composer" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="prompt">
              Prompt
            </label>
            <textarea
              id="prompt"
              name="prompt"
              placeholder="Ask your AI assistant..."
              autoComplete="off"
              rows="2"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={handlePromptKeyDown}
            />
            <button type="submit" aria-label="Send prompt" disabled={isLoading}>
              <Send size={18} aria-hidden="true" />
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);

