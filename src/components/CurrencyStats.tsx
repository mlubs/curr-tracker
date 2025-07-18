import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Euro, Coins } from "lucide-react";

interface CurrencyData {
  date: string;
  USDBRL: number;
  EURBRL: number;
  CNYBRL: number;
}

interface CurrencyStatsProps {
  data: CurrencyData[];
}

export function CurrencyStats({ data }: CurrencyStatsProps) {
  if (data.length === 0) return null;

  const latest = data[data.length - 1];
  const initial = data[0]; // Primeira data do período selecionado

  const calculateChange = (current: number, initial: number) => {
    const change = ((current - initial) / initial) * 100;
    return {
      value: change,
      isPositive: change >= 0
    };
  };

  const usdChange = calculateChange(latest.USDBRL, initial.USDBRL);
  const eurChange = calculateChange(latest.EURBRL, initial.EURBRL);
  const cnyChange = calculateChange(latest.CNYBRL, initial.CNYBRL);

  const stats = [
    {
      title: "USD/BRL",
      value: `R$ ${latest.USDBRL.toFixed(4)}`,
      change: usdChange,
      icon: DollarSign,
      color: "chart-usd"
    },
    {
      title: "EUR/BRL",
      value: `R$ ${latest.EURBRL.toFixed(4)}`,
      change: eurChange,
      icon: Euro,
      color: "chart-eur"
    },
    {
      title: "CNY/BRL",
      value: `R$ ${latest.CNYBRL.toFixed(4)}`,
      change: cnyChange,
      icon: Coins,
      color: "chart-cny"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.change.isPositive ? TrendingUp : TrendingDown;
        
        return (
          <Card key={stat.title} className="bg-gradient-card shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 text-${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs">
                <TrendIcon 
                  className={`mr-1 h-3 w-3 ${
                    stat.change.isPositive ? 'text-primary' : 'text-destructive'
                  }`} 
                />
                <span className={stat.change.isPositive ? 'text-primary' : 'text-destructive'}>
                  {stat.change.value >= 0 ? '+' : ''}{stat.change.value.toFixed(2)}%
                </span>
                <span className="text-muted-foreground ml-1">no período selecionado</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Fonte: {stat.title === 'CNY/BRL' ? 'BCB/ExchangeRate-API' : 'Banco Central do Brasil'}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}