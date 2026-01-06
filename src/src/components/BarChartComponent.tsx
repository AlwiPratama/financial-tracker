interface BarChartProps {
  chartData: Array<{ category: string; amount: number; color: string }>;
  setSelectedChartItem: (item: { category: string; amount: number; color: string } | null) => void;
  formatRupiah: (amount: number) => string;
  themeStyles: {
    textSecondary: string;
  };
}

export default function BarChartComponent({ chartData, setSelectedChartItem, formatRupiah, themeStyles }: BarChartProps) {
  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center opacity-50 font-bold italic">
        Belum ada data grafik
      </div>
    );
  }

  const maxVal = Math.max(...chartData.map(d => d.amount));
  
  return (
    <div className="h-64 flex items-end justify-around gap-2 my-6 px-2">
      {chartData.map((bar, i) => (
        <div 
          key={i} 
          className="flex flex-col items-center w-full group cursor-pointer" 
          onClick={() => setSelectedChartItem(bar)}
        >
          <div 
            className="w-full max-w-[40px] rounded-t-lg transition-all duration-500 hover:opacity-80 relative"
            style={{ height: `${(bar.amount / maxVal) * 200}px`, backgroundColor: bar.color }}
          >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/70 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
              {formatRupiah(bar.amount)}
            </div>
          </div>
          <span className={`text-[8px] mt-2 truncate w-full text-center ${themeStyles.textSecondary}`}>
            {bar.category.split(' ')[0]}
          </span>
        </div>
      ))}
    </div>
  );
}
