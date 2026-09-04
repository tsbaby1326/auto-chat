export type Role = 'user' | 'bot'

export type Message = {
  id: string
  role: Role
  text: string
  createdAt: number
}

export type RuleId =
  | 'greeting'
  | 'status'
  | 'thanks'
  | 'bye'
  | 'help'
  | 'time'
  | 'date'
  | 'weather'
  | 'name'
  | 'joke'

type Rule = {
  id: RuleId
  match: RegExp
  replies: string[]
}

const rules: Rule[] = [
  {
    id: 'greeting',
    match: /\b(hi|hello|hey|yo|howdy)\b/i,
    replies: [
      'Hey there — glad you stopped by. What’s on your mind?',
      'Hello! I’m AutoBot. Ask me anything, or just say hi again.',
      'Hi! Ready when you are.',
    ],
  },
  {
    id: 'status',
    match: /\b(how are you|how's it going|how r u)\b/i,
    replies: [
      'Running smooth on this end. How about you?',
      'Pretty good — circuits humming. What can I help with?',
    ],
  },
  {
    id: 'thanks',
    match: /\b(thank|thanks|thx)\b/i,
    replies: [
      'Anytime.',
      'Happy to help.',
      'You’re welcome — send another message anytime.',
    ],
  },
  {
    id: 'bye',
    match: /\b(bye|goodbye|see you|later)\b/i,
    replies: [
      'Catch you later.',
      'Bye! I’ll be here when you come back.',
      'See you soon.',
    ],
  },
  {
    id: 'help',
    match: /\b(help|what can you do|commands)\b/i,
    replies: [
      'I reply automatically. Try a greeting, ask for the time or date, request a joke, or tap a suggestion chip.',
      'I’m a keyword-aware auto-reply bot. No account, no API key — replies stay on your device.',
    ],
  },
  {
    id: 'time',
    match: /\b(time|clock)\b/i,
    replies: [],
  },
  {
    id: 'date',
    match: /\b(date|today)\b/i,
    replies: [],
  },
  {
    id: 'weather',
    match: /\b(weather|rain|sunny|forecast)\b/i,
    replies: [
      'I don’t have live weather yet — but I’m optimistic it’s a good day for chatting.',
      'No forecast hooked up, but I can still keep you company while you check outside.',
    ],
  },
  {
    id: 'name',
    match: /\b(name|who are you|what are you)\b/i,
    replies: [
      'I’m AutoBot — the auto-reply side of AutoChat.',
      'Call me AutoBot. I respond on my own so you don’t wait around.',
    ],
  },
  {
    id: 'joke',
    match: /\b(joke|funny|laugh)\b/i,
    replies: [
      'Why did the developer go broke? Because they used up all their cache.',
      'I told a UDP joke… I’m not sure if you got it.',
      'Parallel lines have so much in common. It’s a shame they’ll never meet.',
    ],
  },
]

const fallbacks = [
  'Got it — tell me a bit more?',
  'Interesting. What else is on your mind?',
  'I’m listening. Feel free to rephrase or ask something else.',
  'Noted. Want to talk about something specific?',
  'Hmm, I’m still learning that one. Try “help” to see what I handle well.',
]

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}

export function formatClock(now = new Date()): string {
  return now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export function formatCalendar(now = new Date()): string {
  return now.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function getBotReply(userText: string, now = new Date()): string {
  const trimmed = userText.trim()
  if (!trimmed) {
    return 'Say something and I’ll reply right away.'
  }

  for (const rule of rules) {
    if (!rule.match.test(trimmed)) continue
    if (rule.id === 'time') {
      return `It’s ${formatClock(now)} on your device.`
    }
    if (rule.id === 'date') {
      return `Today is ${formatCalendar(now)}.`
    }
    return pick(rule.replies)
  }

  if (/\?$/.test(trimmed)) {
    return pick([
      'Good question. I don’t have a deep answer yet, but I’m here to chat.',
      'I’m not sure — want to try asking another way?',
      'That’s a tough one. Ask me for a joke or the time while I think.',
    ])
  }

  return pick(fallbacks)
}

export function delayForReply(text: string): number {
  const base = 450
  const extra = Math.min(text.length * 12, 900)
  return base + extra + Math.floor(Math.random() * 250)
}

export function formatTranscript(messages: Message[]): string {
  return messages
    .map((message) => {
      const who = message.role === 'bot' ? 'AutoBot' : 'You'
      return `${who} (${formatClock(new Date(message.createdAt))}): ${message.text}`
    })
    .join('\n')
}

export const SUGGESTIONS = ['hello', 'what can you do', 'tell me a joke', 'what time is it'] as const
