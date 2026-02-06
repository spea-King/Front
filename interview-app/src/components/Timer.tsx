interface TimerProps {
  remainingTime: number;
  totalTime: number;
}

export function Timer({ remainingTime, totalTime }: TimerProps) {
  const percentage = (remainingTime / totalTime) * 100;

  // Color based on remaining time
  const getColor = () => {
    if (remainingTime > 60) return 'bg-emerald-500';
    if (remainingTime > 30) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getTextColor = () => {
    if (remainingTime > 60) return 'text-emerald-400';
    if (remainingTime > 30) return 'text-amber-400';
    return 'text-red-400';
  };

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400 uppercase tracking-widest font-semibold">
          Time Remaining
        </span>
        <span className={`text-3xl font-bold tabular-nums transition-colors duration-500 ${getTextColor()}`}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>

      <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-linear ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
