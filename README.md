# Secret Word

A word-guessing game built with React. Guess the hidden word letter by letter, with hints by category. Each correct word scores 100 points; the game tracks time per round and supports letter normalization (e.g. "a" matches "ã", "c" matches "ç").



---

## Tech Stack

| Category      | Technology |
|--------------|------------|
| **Framework** | React 19 |
| **Build**     | Vite 7 |
| **Styling**   | Tailwind CSS 4 |
| **Icons**     | Lucide React |
| **Language**  | JavaScript (JSX) |
| **Deploy**    | Netlify-ready (`_redirects` for SPA) |

### Why These Choices?

- **React 19** – Current React with hooks for state and effects.
- **Vite** – Fast dev server and optimized production builds.
- **Tailwind CSS 4** – Utility-first styling with the official Vite plugin; no custom CSS, only Tailwind classes.
- **Lucide React** – Lightweight, consistent SVG icons (no emojis in UI).
- **LocalStorage** – Persists last score and game history (no backend).

---

## Project Structure

```
secretword/
├── public/
│   ├── favicon.svg          # App icon (W for Word)
│   ├── _redirects           # Netlify SPA fallback (/* → /index.html 200)
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── StartScreen.jsx  # Welcome, last score, "Começar"
│   │   ├── Game.jsx         # Main game: word, input, score, time, wrong letters
│   │   └── GameOver.jsx     # Result, score, time, "Jogar novamente"
│   ├── data/
│   │   └── data.jsx         # wordsList: categories and ~800 words (PT-BR)
│   ├── utils/
│   │   ├── storage.js       # localStorage: scores, last score, guessed words, records
│   │   └── letters.js       # normalizeLetter() for a/ã, c/ç matching
│   ├── App.jsx              # State, stages (start/game/end), word pick, score logic
│   ├── main.jsx             # React root
│   └── index.css             # Tailwind import only
├── index.html
├── package.json
├── vite.config.js            # Vite + React + Tailwind plugins
└── README.md
```

### Main Flows

- **App.jsx** – Holds game state (stage, word, letters, score, time, etc.), picks words avoiding already guessed ones, applies +100 per word and saves score on game over.
- **Game** – Renders word slots (revealed/blank), input, Verificar button, score/time header, wrong letters; uses `normalizeLetter` so typing "a" reveals "ã" in words like "mamão".
- **storage.js** – Saves/loads last score, score history (per-game points + time), and guessed words so the same word is not repeated in a run.

---

## Development

### Prerequisites

- Node.js (recommended: 18+)
- npm (or yarn/pnpm)

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the URL shown in the terminal).

### Build

```bash
npm run build
```

Output is in `dist/`. Preview the production build:

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Game Rules (short)

- You have **5 attempts** per word.
- Guess one letter at a time; correct letters appear in place.
- **+100 points** per word guessed.
- Letters are normalized: e.g. "a" matches "ã", "c" matches "ç".
- Time is shown per word and for the full game; last score is kept in localStorage.

---

## Deployment (e.g. Netlify)

- Build command: `npm run build`
- Publish directory: `dist`
- `public/_redirects` is copied into `dist` by Vite, so Netlify serves `index.html` for all routes (SPA).

---

If you found this useful or fun, consider giving it a star ⭐ — it helps a lot!
