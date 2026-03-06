import { Play, Trophy } from "lucide-react";

export default function StartScreen({ startGame, lastScore }) {
  return (
    <div className="w-full max-w-md mx-auto overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-lg backdrop-blur-sm">
      <div className="py-12 flex flex-col items-center gap-8 px-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Secret Word
        </h1>
        {lastScore != null && (
          <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
            Última pontuação: <span className="text-slate-700 font-semibold">{lastScore}</span>
          </p>
        )}
        <p className="text-slate-600 text-sm">
          Clique no botão abaixo para começar a jogar
        </p>
        <button
          onClick={startGame}
          className="inline-flex items-center gap-2 px-6 py-3 font-medium text-white bg-slate-600 hover:bg-slate-700 rounded-lg shadow-sm hover:shadow transition-all duration-200"
        >
          <Play className="w-4 h-4" strokeWidth={2} />
          Começar
        </button>
      </div>
    </div>
  );
}
