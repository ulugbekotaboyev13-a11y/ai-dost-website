"use client";

import { useState } from "react";

export default function Home() {
  const [tab, setTab] = useState("chat");

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          AI <span>Dost</span>
        </div>
        <nav className="nav">
          <button
            className={"nav-item" + (tab === "chat" ? " active" : "")}
            onClick={() => setTab("chat")}
          >
            💬 Suhbat
          </button>
          <button
            className={"nav-item" + (tab === "image" ? " active" : "")}
            onClick={() => setTab("image")}
          >
            🎨 Rasm yaratish
          </button>
        </nav>
      </aside>

      <main className="main">
        {tab === "chat" ? <ChatPanel /> : <ImagePanel />}
      </main>
    </div>
  );
}

function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();

      if (data.error) {
        setMessages((m) => [...m, { role: "assistant", content: "Xato: " + data.error }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      }
    } catch (err) {
      setMessages((m) => [...m, { role: "assistant", content: "Ulanishda xatolik yuz berdi." }]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      <div className="panel-header">
        <h1>Suhbat</h1>
        <p>Savolingizni yozing, AI javob beradi.</p>
      </div>

      <div className="chat-log">
        {messages.length === 0 && (
          <div className="bubble empty">Hali xabar yo'q. Pastdan yozib boshlang.</div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={"bubble " + m.role}>
            {m.content}
          </div>
        ))}
        {loading && <div className="bubble assistant">Yozmoqda…</div>}
      </div>

      <div className="composer">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Xabar yozing…"
        />
        <button className="send-btn" onClick={send} disabled={loading || !input.trim()}>
          Yuborish
        </button>
      </div>
    </>
  );
}

function ImagePanel() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);

  function generate(e) {
    e.preventDefault();
    const text = prompt.trim();
    if (!text) return;

    const seed = Date.now();
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(text)}?width=512&height=512&seed=${seed}&nologo=true`;

    setImages((imgs) => [{ url, prompt: text }, ...imgs]);
    setPrompt("");
  }

  return (
    <>
      <div className="panel-header">
        <h1>Rasm yaratish</h1>
        <p>Nimani tasvirlab bermoqchisiz? Inglizcha yoki o'zbekcha yozing.</p>
      </div>

      <div className="image-panel">
        <form className="image-form" onSubmit={generate}>
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Masalan: qorli tog' cho'qqisida chiroq yonib turgan uy"
          />
          <button className="send-btn" type="submit" disabled={!prompt.trim()}>
            Yaratish
          </button>
        </form>

        <div className="image-grid">
          {images.map((img, i) => (
            <div className="image-card" key={i}>
              <img src={img.url} alt={img.prompt} loading="lazy" />
              <p>{img.prompt}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
    }
