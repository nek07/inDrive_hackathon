import React from 'react';

interface ScaleIndicatorProps {
  title: string;
  value: number;
  description: string;
  className?: string;
}

export function ScaleIndicator({ title, value, description, className = "" }: ScaleIndicatorProps) {
  const getColorForValue = (val: number) => {
    if (val <= 1.5) return '#22c55e'; // green-500
    if (val <= 2.5) return '#84cc16'; // lime-500
    if (val <= 3.5) return '#eab308'; // yellow-500
    if (val <= 4.5) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
  };

  const getBackgroundGradient = () => {
    return 'linear-gradient(to right, #22c55e 0%, #84cc16 25%, #eab308 50%, #f97316 75%, #ef4444 100%)';
  };

  const getPositionPercentage = (val: number) => {
    return ((val - 1) / 4) * 100;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-foreground">{title}</h3>
        <div className="flex items-center gap-2">
          <span 
            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: getColorForValue(value) }}
          />
          <span className="font-medium text-foreground">{value.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="relative">
        {/* Gradient background */}
        <div 
          className="h-3 rounded-full shadow-inner"
          style={{ background: getBackgroundGradient() }}
        />
        
        {/* Scale markers */}
        <div className="flex justify-between items-center mt-2">
          {[1, 2, 3, 4, 5].map((marker) => (
            <div key={marker} className="flex flex-col items-center">
              <div className="w-px h-2 bg-gray-400" />
              <span className="text-xs text-muted-foreground mt-1">{marker}</span>
            </div>
          ))}
        </div>
        
        {/* Value indicator */}
        <div 
          className="absolute top-0 w-6 h-6 bg-white rounded-full border-3 shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-1"
          style={{ 
            left: `${getPositionPercentage(value)}%`,
            borderColor: getColorForValue(value)
          }}
        >
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getColorForValue(value) }}
          />
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}