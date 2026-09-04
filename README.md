# AutoChat

A small React demo where **AutoBot** replies on its own. No accounts, no API keys, and no network calls — keyword replies run in the browser, and the thread is saved in `localStorage`.

**Live demo:** [tsbaby1326.github.io/auto-chat](https://tsbaby1326.github.io/auto-chat/)

[![CI](https://github.com/tsbaby1326/auto-chat/actions/workflows/ci.yml/badge.svg)](https://github.com/tsbaby1326/auto-chat/actions/workflows/ci.yml)

## Features

- Auto-replies with a short typing delay
- Suggestions for greetings, help, jokes, and time
- Conversation stays in this browser until you clear it
- Enter to send, Shift+Enter for a new line

## Run

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm test
npm run build
```

## How replies work

`src/bot.ts` matches the last message against a short list of rules (hello, help, time, date, jokes, and a few others). Unmatched messages get a fallback. Time and date use the clock on the visitor’s device.

This is a UI demo, not a language model.

## License

MIT
