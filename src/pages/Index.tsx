import { useState } from "react";
import { addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyChart } from "@/components/CurrencyChart";
import { DateRangePicker } from "@/components/DateRangePicker";
import { PeriodSelector, Period } from "@/components/PeriodSelector";
import { CurrencyStats } from "@/components/CurrencyStats";
import { useCurrencyData } from "@/hooks/useCurrencyData";
import { LineChart, Calendar, TrendingUp } from "lucide-react";

const Index = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(addDays(new Date(), -30));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [period, setPeriod] = useState<Period>('daily');

  const data = useCurrencyData(startDate, endDate, period);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
            <LineChart className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Painel de Cotações</h1>
            <p className="text-muted-foreground">Acompanhe as cotações USD/BRL, EUR/BRL e CNY/BRL</p>
          </div>
        </div>

        {/* Filtros */}
        <Card className="bg-gradient-card shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="text-sm font-medium mb-2 block">Período:</label>
                <PeriodSelector selectedPeriod={period} onPeriodChange={setPeriod} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Intervalo de datas:</label>
                <DateRangePicker
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <CurrencyStats data={data} />

        {/* Gráfico */}
        <Card className="bg-gradient-card shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Evolução das Cotações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CurrencyChart data={data} />
          </CardContent>
        </Card>

        {/* Legenda */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-chart-usd rounded-full"></div>
            <span>USD/BRL - Dólar Americano (eixo esquerdo)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-chart-eur rounded-full"></div>
            <span>EUR/BRL - Euro (eixo esquerdo)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-chart-cny rounded-full"></div>
            <span>CNY/BRL - Yuan Chinês (eixo direito)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
