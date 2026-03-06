import { useState, useRef, useEffect } from "react";
import { Star, Clock, Check, XCircle } from "lucide-react";
import { normalizeLetter } from "../utils/letters";

export default function Game({
  verifyLetter,
  pickedWord,
  pickedCategory,
  letters,
  guessedLetters,
  wrongLetters,
  guesses,
  score,
  wordStartTime,
  showPlus100 = false,
}) {
  const [letter, setLetter] = useState("");
  const letterInputRef = useRef(null);
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    if (!wordStartTime) return;
    const id = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - wordStartTime) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [wordStartTime]);

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyLetter(letter);
    setLetter("");
    letterInputRef.current.focus();
  };

  return (
    <div className="w-full max-w-xl mx-auto overflow-hidden relative bg-white border border-slate-200 rounded-2xl shadow-lg backdrop-blur-sm">
      <div className="border-b border-slate-200 px-6 py-3.5 flex flex-row items-center justify-between gap-4 flex-wrap bg-slate-50/80">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium text-slate-600 flex items-center gap-2">
            <Star className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
            Pontuação: <span className="tabular-nums font-semibold text-slate-800">{score}</span>
          </p>
          {showPlus100 && (
            <p className="text-[10px] text-slate-500 pl-6">+100 por acerto</p>
          )}
        </div>
        {wordStartTime != null && (
          <p className="text-sm font-medium text-slate-600 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
            Tempo: <span className="tabular-nums font-semibold text-slate-800">{elapsedSec}s</span>
          </p>
        )}
      </div>

      <div className="px-6 py-8 flex flex-col gap-6 text-center relative">
        <h1 className="text-xl font-bold text-slate-800">Adivinhe a palavra:</h1>
        <p className="text-slate-600 text-sm">
          Dica: <span className="font-semibold text-slate-800">{pickedCategory}</span>
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {letters.map((l, i) =>
            guessedLetters.some((g) => normalizeLetter(g) === normalizeLetter(l)) ? (
              <span
                key={i}
                className="inline-flex items-center justify-center min-w-10 h-12 text-xl font-semibold text-slate-800 rounded-lg border-2 border-slate-300 bg-white uppercase shadow-sm"
              >
                {l}
              </span>
            ) : (
              <span
                key={i}
                className="inline-block min-w-10 h-12 rounded-lg border-2 border-dashed border-slate-300 bg-slate-100"
              />
            )
          )}
        </div>

        <p className="text-slate-600 text-sm">Você possui <strong className="text-slate-800">{guesses}</strong> tentativa(s).</p>

        <form className="flex flex-col items-center gap-3" onSubmit={handleSubmit}>
          <p className="text-sm font-medium text-slate-600">Digite uma letra:</p>
          <div className="flex flex-row items-center gap-3">
            <input
              type="text"
              name="letter"
              maxLength={1}
              required
              className="w-14 h-11 text-center text-lg font-semibold rounded-lg border-2 border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all bg-white text-slate-800"
              onChange={(e) => setLetter(e.target.value)}
              value={letter}
              ref={letterInputRef}
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2.5 font-medium text-white bg-slate-600 hover:bg-slate-700 rounded-lg shadow-sm hover:shadow transition-all duration-200"
            >
              <Check className="w-4 h-4" strokeWidth={2} />
              Verificar
            </button>
          </div>
        </form>

        <div className="mt-2 flex items-center justify-start gap-2">
          <XCircle className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={1.5} />
          <p className="text-sm text-slate-600">
            {wrongLetters.length > 0
              ? wrongLetters.map((l, i) => <span key={i} className="uppercase">{l}{i < wrongLetters.length - 1 ? " — " : ""}</span>)
              : "Nenhuma"}
          </p>
        </div>

      </div>
    </div>
  );
}
