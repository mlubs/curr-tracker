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
  const formatTooltipValue = (value: number, name: string) => {
    return [`R$ ${value.toFixed(4)}`, name];
  };

  const formatTooltipLabel = (label: string) => {
    return format(new Date(label), 'dd/MM/yyyy');
  };

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
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
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickFormatter={(value) => `R$ ${value.toFixed(2)}`}
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
          <Legend />
          <Line 
            type="monotone" 
            dataKey="USDBRL" 
            stroke="hsl(var(--chart-usd))" 
            strokeWidth={2}
            dot={false}
            name="USD/BRL"
          />
          <Line 
            type="monotone" 
            dataKey="EURBRL" 
            stroke="hsl(var(--chart-eur))" 
            strokeWidth={2}
            dot={false}
            name="EUR/BRL"
          />
          <Line 
            type="monotone" 
            dataKey="CNYBRL" 
            stroke="hsl(var(--chart-cny))" 
            strokeWidth={2}
            dot={false}
            name="CNY/BRL"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}