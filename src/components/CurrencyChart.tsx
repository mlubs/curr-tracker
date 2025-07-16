import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface CurrencyData {
  date: string;
  USDBRL: number;
  EURBRL: number;
  CNYBRL: number;
}

interface CurrencyChartProps {
  data: CurrencyData[];
}

export function CurrencyChart({ data }: CurrencyChartProps) {
  const [visibleLines, setVisibleLines] = useState({
    USDBRL: true,
    EURBRL: true,
    CNYBRL: true
  });

  const formatTooltipValue = (value: number, name: string) => {
    return [`R$ ${value.toFixed(4)}`, name];
  };

  const formatTooltipLabel = (label: string) => {
    return format(new Date(label), 'dd/MM/yyyy');
  };

  const handleLegendClick = (dataKey: string) => {
    setVisibleLines(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey as keyof typeof prev]
    }));
  };

  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex justify-center gap-6 mb-4">
        {payload.map((entry: any, index: number) => (
          <div
            key={`item-${index}`}
            className={`flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 ${
              !visibleLines[entry.dataKey as keyof typeof visibleLines] ? 'opacity-50' : ''
            }`}
            onClick={() => handleLegendClick(entry.dataKey)}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm select-none">
              {entry.value}
              {!visibleLines[entry.dataKey as keyof typeof visibleLines] && ' (oculto)'}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 50,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => format(new Date(value), 'dd/MM')}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          {/* Eixo Y esquerdo para USD e EUR */}
          <YAxis 
            yAxisId="left"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickFormatter={(value) => `R$ ${value.toFixed(2)}`}
            orientation="left"
          />
          {/* Eixo Y direito para CNY */}
          <YAxis 
            yAxisId="right"
            stroke="hsl(var(--chart-cny))"
            fontSize={12}
            tickFormatter={(value) => `R$ ${value.toFixed(2)}`}
            orientation="right"
          />
          <Tooltip 
            formatter={formatTooltipValue}
            labelFormatter={formatTooltipLabel}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--card-foreground))'
            }}
          />
          <Legend content={<CustomLegend />} />
          {visibleLines.USDBRL && (
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="USDBRL" 
              stroke="hsl(var(--chart-usd))" 
              strokeWidth={2}
              dot={false}
              name="USD/BRL"
            />
          )}
          {visibleLines.EURBRL && (
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="EURBRL" 
              stroke="hsl(var(--chart-eur))" 
              strokeWidth={2}
              dot={false}
              name="EUR/BRL"
            />
          )}
          {visibleLines.CNYBRL && (
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="CNYBRL" 
              stroke="hsl(var(--chart-cny))" 
              strokeWidth={2}
              dot={false}
              name="CNY/BRL (eixo direito)"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}