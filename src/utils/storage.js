const KEY_GUESSED_WORDS = "secretword_guessed_words";
const KEY_SCORES = "secretword_scores";
const KEY_LAST_SCORE = "secretword_last_score";
const KEY_RECORDS = "secretword_records";

// Retorna lista de palavras já acertadas.
export function getGuessedWords() {
  try {
    const data = localStorage.getItem(KEY_GUESSED_WORDS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Marca palavra como já jogada.
export function addGuessedWord(word) {
  const list = getGuessedWords();
  const normalized = word.toLowerCase().trim();
  if (normalized && !list.includes(normalized)) {
    list.push(normalized);
    localStorage.setItem(KEY_GUESSED_WORDS, JSON.stringify(list));
  }
}

// Limpa lista de palavras jogadas.
export function clearGuessedWords() {
  localStorage.setItem(KEY_GUESSED_WORDS, JSON.stringify([]));
}

// Retorna histórico de partidas.
export function getScores() {
  try {
    const data = localStorage.getItem(KEY_SCORES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Salva resultado da partida no histórico.
export function saveScore(scoreThisGame, gameTimeMs = null, extras = null, totalScore = null) {
  const list = getScores();
  list.push({
    score: scoreThisGame,
    date: new Date().toISOString(),
    gameTimeMs: gameTimeMs ?? undefined,
    extras: extras != null ? extras : undefined,
  });
  localStorage.setItem(KEY_SCORES, JSON.stringify(list));
  localStorage.setItem(KEY_LAST_SCORE, String(totalScore != null ? totalScore : scoreThisGame));
}

// Retorna última pontuação salva.
export function getLastScore() {
  try {
    const value = localStorage.getItem(KEY_LAST_SCORE);
    return value !== null ? Number(value) : null;
  } catch {
    return null;
  }
}

// Retorna recordes de tempo por palavra.
export function getRecords() {
  try {
    const data = localStorage.getItem(KEY_RECORDS);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

// Retorna tempo recorde da palavra (ms).
export function getRecordTimeMs(word) {
  const records = getRecords();
  const key = word.toLowerCase().trim();
  return records[key] ?? null;
}

// Atualiza tempo recorde da palavra.
export function setRecordTimeMs(word, timeMs) {
  const records = getRecords();
  const key = word.toLowerCase().trim();
  records[key] = timeMs;
  localStorage.setItem(KEY_RECORDS, JSON.stringify(records));
}

// Verifica se o tempo é novo recorde para a palavra.
export function isNewRecord(word, timeMs) {
  const current = getRecordTimeMs(word);
  return current === null || timeMs < current;
}
