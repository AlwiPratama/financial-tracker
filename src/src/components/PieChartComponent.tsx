interface PieChartProps {
  chartData: Array<{ category: string; amount: number; color: string }>;
  totalChartAmount: number;
  setSelectedChartItem: (item: { category: string; amount: number; color: string } | null) => void;
}

export default function PieChartComponent({ chartData, totalChartAmount, setSelectedChartItem }: PieChartProps) {
  let cumulativePercent = 0;
  
  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center opacity-50 font-bold italic">
        Belum ada data grafik
      </div>
    );
  }

  return (
    <div className="relative h-64 w-64 mx-auto my-6 group cursor-pointer">
      <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full overflow-visible">
        {chartData.map((slice, i) => {
          const percent = slice.amount / totalChartAmount;
          const startX = Math.cos(2 * Math.PI * cumulativePercent);
          const startY = Math.sin(2 * Math.PI * cumulativePercent);
          cumulativePercent += percent;
          const endX = Math.cos(2 * Math.PI * cumulativePercent);
          const endY = Math.sin(2 * Math.PI * cumulativePercent);
          const largeArcFlag = percent > 0.5 ? 1 : 0;
          
          const pathData = chartData.length === 1 
            ? "M 1 0 A 1 1 0 1 1 -1 0 A 1 1 0 1 1 1 0" 
            : `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

          return (
            <path 
              key={i} 
              d={pathData} 
              fill={slice.color} 
              className="hover:opacity-80 transition-all duration-300 hover:scale-105 origin-center"
              onClick={() => setSelectedChartItem(slice)}
            />
          );
        })}
      </svg>
    </div>
  );
}
