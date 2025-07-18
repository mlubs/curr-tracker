import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface CurrencyData {
  date: string;
  USDBRL: number;
  EURBRL: number;
  CNYBRL: number;
}

interface CurrencyParityChartProps {
  data: CurrencyData[];
}

const currencies = [
  { value: 'USDBRL', label: 'USD/BRL', key: 'USDBRL' },
  { value: 'EURBRL', label: 'EUR/BRL', key: 'EURBRL' },
  { value: 'CNYBRL', label: 'CNY/BRL', key: 'CNYBRL' }
];

export function CurrencyParityChart({ data }: CurrencyParityChartProps) {
  const [currency1, setCurrency1] = useState<string>('USDBRL');
  const [currency2, setCurrency2] = useState<string>('EURBRL');

  const calculateParity = () => {
    return data.map(item => {
      const value1 = item[currency1 as keyof CurrencyData] as number;
      const value2 = item[currency2 as keyof CurrencyData] as number;
      const parity = value2 > 0 ? value1 / value2 : 0;
      
      return {
        date: item.date,
        parity: parity,
        currency1Value: value1,
        currency2Value: value2
      };
    });
  };

  const parityData = calculateParity();
  
  const currency1Label = currencies.find(c => c.value === currency1)?.label || currency1;
  const currency2Label = currencies.find(c => c.value === currency2)?.label || currency2;
  const parityLabel = `${currency1Label} / ${currency2Label}`;

  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'parity') {
      return [`${value.toFixed(4)}`, parityLabel];
    }
    return [`R$ ${value.toFixed(4)}`, name];
  };

  const formatTooltipLabel = (label: string) => {
    return format(new Date(label), 'dd/MM/yyyy');
  };

  return (
    <Card className="bg-gradient-card shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Paridade entre Moedas
        </CardTitle>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Moeda Base:</label>
            <Select value={currency1} onValueChange={setCurrency1}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Moeda Comparação:</label>
            <Select value={currency2} onValueChange={setCurrency2}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={parityData}
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
                tickFormatter={(value) => value.toFixed(4)}
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
                dataKey="parity" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
                name={parityLabel}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}