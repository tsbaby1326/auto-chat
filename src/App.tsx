import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import {
  delayForReply,
  getBotReply,
  SUGGESTIONS,
  type Message,
} from './bot'
import './App.css'

const STORAGE_KEY = 'autochat.messages.v1'

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const welcome: Message = {
  id: 'welcome',
  role: 'bot',
  text: 'Hi — I’m AutoBot. Send a message and I’ll reply on my own. Your chat stays in this browser.',
  createdAt: Date.now(),
}

function loadMessages(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return [welcome]
    const parsed = JSON.parse(raw) as Message[]
    if (!Array.isArray(parsed) || parsed.length === 0) return [welcome]
    return parsed
  } catch {
    return [welcome]
  }
}

function formatStamp(ms: number) {
  return new Date(ms).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>(loadMessages)
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const replyTimer = useRef<number | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    return () => {
      if (replyTimer.current !== null) {
        window.clearTimeout(replyTimer.current)
      }
    }
  }, [])

  function sendMessage(raw?: string) {
    const text = (raw ?? draft).trim()
    if (!text || typing) return

    const userMessage: Message = {
      id: createId(),
      role: 'user',
      text,
      createdAt: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setDraft('')
    setTyping(true)

    const replyText = getBotReply(text)
    const wait = delayForReply(text)

    replyTimer.current = window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: 'bot',
          text: replyText,
          createdAt: Date.now(),
        },
      ])
      setTyping(false)
      inputRef.current?.focus()
    }, wait)
  }

  function clearChat() {
    if (replyTimer.current !== null) {
      window.clearTimeout(replyTimer.current)
      replyTimer.current = null
    }
    setTyping(false)
    setMessages([
      {
        ...welcome,
        id: createId(),
        createdAt: Date.now(),
        text: 'Chat cleared. I’m still here — send a new message whenever you like.',
      },
    ])
    inputRef.current?.focus()
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="shell">
      <div className="glow glow-a" aria-hidden="true" />
      <div className="glow glow-b" aria-hidden="true" />

      <main className="stage">
        <header className="brand">
          <div>
            <p className="logo">AutoChat</p>
            <p className="tagline">Type anything — replies land on their own.</p>
          </div>
          <p className="status">
            <span className="status-dot" aria-hidden="true" />
            AutoBot online
          </p>
        </header>

        <section className="chat" aria-label="Chat conversation">
          <div className="toolbar">
            <p className="hint">Local demo — no accounts, no network calls.</p>
            <button type="button" className="ghost" onClick={clearChat}>
              Clear chat
            </button>
          </div>

          <div className="thread" ref={listRef} role="log" aria-live="polite">
            {messages.map((message) => (
              <article key={message.id} className={`bubble ${message.role}`}>
                <span className="who">
                  {message.role === 'bot' ? 'AutoBot' : 'You'}
                  <time dateTime={new Date(message.createdAt).toISOString()}>
                    {formatStamp(message.createdAt)}
                  </time>
                </span>
                <p>{message.text}</p>
              </article>
            ))}

            {typing && (
              <div className="bubble bot typing" aria-label="AutoBot is typing">
                <span className="who">AutoBot</span>
                <div className="dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>

          <div className="chips" aria-label="Suggested messages">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="chip"
                disabled={typing}
                onClick={() => sendMessage(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <form
            className="composer"
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage()
            }}
          >
            <label className="sr-only" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              ref={inputRef}
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Write a message…"
              disabled={typing}
            />
            <button type="submit" disabled={!draft.trim() || typing}>
              Send
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}
