import StartScreen from "./components/StartScreen";
import { useState, useEffect, useCallback } from "react";
import { wordsList } from "./data/data";
import Game from "./components/Game";
import GameOver from "./components/GameOver";
import {
  getGuessedWords,
  addGuessedWord,
  clearGuessedWords,
  saveScore,
  getLastScore,
} from "./utils/storage";
import { normalizeLetter } from "./utils/letters";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const GUESSES_QTY = 5;
const POINTS_PER_WORD = 100;

// Retorna lista de todas as palavras com sua categoria.
function getAllWordsFlat(words) {
  const result = [];
  Object.keys(words).forEach((category) => {
    words[category].forEach((word) => result.push({ word, category }));
  });
  return result;
}

// Escolhe uma palavra aleatória que ainda não foi jogada.
function pickWordExcludingGuessed(words, clearIfNone = false) {
  let guessed = getGuessedWords();
  let all = getAllWordsFlat(words).filter(
    ({ word }) => !guessed.includes(word.toLowerCase())
  );
  if (all.length === 0 && clearIfNone) {
    clearGuessedWords();
    all = getAllWordsFlat(words);
  }
  if (all.length === 0) return null;
  return all[Math.floor(Math.random() * all.length)];
}

export default function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(GUESSES_QTY);
  const [score, setScore] = useState(0);
  const [wordStartTime, setWordStartTime] = useState(null);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [lastGameTimeMs, setLastGameTimeMs] = useState(null);
  const [lastGamePointsThisGame, setLastGamePointsThisGame] = useState(null);
  const [scoreAtGameStart, setScoreAtGameStart] = useState(0);
  const [showPlus100, setShowPlus100] = useState(false);

  const pickNextWord = useCallback((allowClearGuessed = false) => {
    const picked = pickWordExcludingGuessed(words, allowClearGuessed);
    if (!picked) return false;
    const { word, category } = picked;
    const wordLetters = word.split("").map((l) => l.toLowerCase());
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);
    setWordStartTime(Date.now());
    return true;
  }, [words]);

  const StartGame = useCallback(() => {
    const last = getLastScore() ?? 0;
    setScore(last);
    setScoreAtGameStart(last);
    setGuessedLetters([]);
    setWrongLetters([]);
    setGuesses(GUESSES_QTY);
    setGameStartTime(Date.now());
    const ok = pickNextWord(true);
    if (!ok) {
      setGameStage(stages[0].name);
      return;
    }
    setGameStage(stages[1].name);
  }, [pickNextWord]);

  const VerifyLetter = (letter) => {
    const normalizedGuess = normalizeLetter(letter);
    if (!normalizedGuess) return;
    const alreadyGuessed = guessedLetters.some((g) => normalizeLetter(g) === normalizedGuess);
    const alreadyWrong = wrongLetters.some((w) => normalizeLetter(w) === normalizedGuess);
    if (alreadyGuessed || alreadyWrong) return;
    const matchingInWord = letters.filter((l) => normalizeLetter(l) === normalizedGuess);
    if (matchingInWord.length > 0) {
      setGuessedLetters((prev) => [...new Set([...prev, ...matchingInWord])]);
    } else {
      setWrongLetters((prev) => [...prev, letter.toLowerCase()]);
      setGuesses((prev) => prev - 1);
    }
  };

  const clearLetterStates = useCallback(() => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }, []);

  useEffect(() => {
    if (guesses <= 0) {
      clearLetterStates();
      const timeMs = gameStartTime ? Date.now() - gameStartTime : null;
      const pointsThisGame = score - scoreAtGameStart;
      saveScore(pointsThisGame, timeMs, undefined, score);
      setLastGamePointsThisGame(pointsThisGame);
      setLastGameTimeMs(timeMs);
      setGameStage(stages[2].name);
    }
  }, [guesses, score, scoreAtGameStart, gameStartTime, clearLetterStates]);

  useEffect(() => {
    if (letters.length === 0) return;
    const allLettersRevealed = letters.every((l) =>
      guessedLetters.some((g) => normalizeLetter(g) === normalizeLetter(l))
    );
    if (!allLettersRevealed) return;

    setScore((prev) => prev + POINTS_PER_WORD);
    setShowPlus100(true);
    addGuessedWord(pickedWord);
    clearLetterStates();
    setGuesses(GUESSES_QTY);

    const hasNext = pickNextWord(false);
    if (!hasNext) {
      const timeMs = gameStartTime ? Date.now() - gameStartTime : null;
      const newTotal = score + POINTS_PER_WORD;
      const pointsThisGame = newTotal - scoreAtGameStart;
      saveScore(pointsThisGame, timeMs, undefined, newTotal);
      setLastGamePointsThisGame(pointsThisGame);
      setLastGameTimeMs(timeMs);
      setGameStage(stages[2].name);
    }
  }, [
    guessedLetters,
    letters,
    pickedWord,
    score,
    gameStartTime,
    scoreAtGameStart,
    pickNextWord,
    clearLetterStates,
  ]);

  useEffect(() => {
    if (!showPlus100) return;
    const t = setTimeout(() => setShowPlus100(false), 2500);
    return () => clearTimeout(t);
  }, [showPlus100]);

  const Retry = () => {
    setScore(0);
    setGuesses(GUESSES_QTY);
    setGameStage(stages[0].name);
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4 font-sans text-slate-700 bg-[linear-gradient(165deg,#f1f5f9_0%,#e2e8f0_45%,#cbd5e1_100%)]">
      {gameStage === "start" && <StartScreen startGame={StartGame} lastScore={getLastScore()} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={VerifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
          wordStartTime={wordStartTime}
          showPlus100={showPlus100}
        />
      )}
      {gameStage === "end" && <GameOver retry={Retry} score={lastGamePointsThisGame ?? score} lastGameTimeMs={lastGameTimeMs} />}
    </div>
  );
}