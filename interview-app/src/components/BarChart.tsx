interface BarChartProps {
  value: number;
  maxValue: number;
  label: string;
}

export function BarChart({ value, maxValue, label }: BarChartProps) {
  const percentage = (value / maxValue) * 100;

  const getColor = () => {
    if (value < maxValue * 0.4) return 'bg-red-500';
    if (value < maxValue * 0.7) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-300">{label}</span>
        <span className="text-sm font-semibold text-gray-100">{value}s</span>
      </div>

      <div className="relative h-8 bg-gray-800 rounded-lg overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full ${getColor()} transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
