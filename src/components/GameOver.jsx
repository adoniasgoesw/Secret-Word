import { RotateCcw, Trophy, Clock } from "lucide-react";

export default function GameOver({ retry, score, lastGameTimeMs }) {
  const formatTime = (ms) => {
    if (ms == null) return "—";
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return m > 0 ? `${m}min ${s % 60}s` : `${s}s`;
  };

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-lg backdrop-blur-sm">
      <div className="py-12 flex flex-col items-center gap-6 px-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Game Over
        </h1>
        <div className="flex flex-col items-center gap-2 text-slate-600 text-sm">
          <p className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
            Pontuação: <strong className="text-slate-800 tabular-nums">{score} pts</strong>
          </p>
          {lastGameTimeMs != null && (
            <p className="flex items-center gap-2 text-slate-500">
              <Clock className="w-4 h-4" strokeWidth={1.5} />
              <span className="tabular-nums">{formatTime(lastGameTimeMs)}</span>
            </p>
          )}
        </div>
        <button
          onClick={retry}
          className="inline-flex items-center gap-2 px-6 py-3 font-medium text-white bg-slate-600 hover:bg-slate-700 rounded-lg shadow-sm hover:shadow transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" strokeWidth={2} />
          Jogar novamente
        </button>
      </div>
    </div>
  );
}
