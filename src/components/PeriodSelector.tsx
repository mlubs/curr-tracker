import { Button } from "@/components/ui/button";

export type Period = 'daily' | 'weekly' | 'monthly';

interface PeriodSelectorProps {
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
}

export function PeriodSelector({ selectedPeriod, onPeriodChange }: PeriodSelectorProps) {
  const periods = [
    { value: 'daily' as Period, label: 'Diário' },
    { value: 'weekly' as Period, label: 'Semanal' },
    { value: 'monthly' as Period, label: 'Mensal' },
  ];

  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      {periods.map((period) => (
        <Button
          key={period.value}
          variant={selectedPeriod === period.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onPeriodChange(period.value)}
          className={selectedPeriod === period.value ? "bg-primary" : ""}
        >
          {period.label}
        </Button>
      ))}
    </div>
  );
}