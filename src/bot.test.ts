import { describe, expect, it } from 'vitest'
import { formatCalendar, formatClock, formatTranscript, getBotReply } from './bot'

describe('getBotReply', () => {
  it('asks for a message when the input is empty', () => {
    expect(getBotReply('   ')).toMatch(/say something/i)
  })

  it('returns a greeting for hello', () => {
    const reply = getBotReply('hello there')
    expect(reply.toLowerCase()).toMatch(/hey|hello|hi!/)
  })

  it('returns device time for a time request', () => {
    const now = new Date('2026-08-26T17:48:00')
    expect(getBotReply('what time is it', now)).toBe(
      `It’s ${formatClock(now)} on your device.`,
    )
  })

  it('returns the calendar date', () => {
    const now = new Date('2026-08-26T17:48:00')
    expect(getBotReply('what is today', now)).toBe(
      `Today is ${formatCalendar(now)}.`,
    )
  })

  it('does not treat the word day alone as a date question', () => {
    const reply = getBotReply('I had a long day')
    expect(reply).not.toMatch(/^Today is /)
  })

  it('formats a transcript with speakers and times', () => {
    const at = new Date('2026-08-26T17:48:00').getTime()
    const text = formatTranscript([
      { id: '1', role: 'user', text: 'hello', createdAt: at },
      { id: '2', role: 'bot', text: 'Hi! Ready when you are.', createdAt: at },
    ])
    expect(text).toContain(`You (${formatClock(new Date(at))}): hello`)
    expect(text).toContain(`AutoBot (${formatClock(new Date(at))}): Hi! Ready when you are.`)
  })
})
