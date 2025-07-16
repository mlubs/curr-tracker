import { useMemo } from 'react';
import { addDays, addWeeks, addMonths, format, isAfter, isBefore } from 'date-fns';
import { Period } from '@/components/PeriodSelector';

interface CurrencyData {
  date: string;
  USDBRL: number;
  EURBRL: number;
  CNYBRL: number;
}

// Função para gerar dados simulados de cotação
function generateMockData(startDate: Date, endDate: Date, period: Period): CurrencyData[] {
  const data: CurrencyData[] = [];
  let currentDate = new Date(startDate);
  
  // Valores base das moedas (aproximados)
  const baseRates = {
    USDBRL: 5.2,
    EURBRL: 5.8,
    CNYBRL: 0.73
  };

  while (isBefore(currentDate, endDate) || currentDate.getTime() === endDate.getTime()) {
    // Simula variações realistas nas cotações
    const usdVariation = (Math.random() - 0.5) * 0.2; // ±10%
    const eurVariation = (Math.random() - 0.5) * 0.2; // ±10%
    const cnyVariation = (Math.random() - 0.5) * 0.15; // ±7.5%

    data.push({
      date: format(currentDate, 'yyyy-MM-dd'),
      USDBRL: Number((baseRates.USDBRL + baseRates.USDBRL * usdVariation).toFixed(4)),
      EURBRL: Number((baseRates.EURBRL + baseRates.EURBRL * eurVariation).toFixed(4)),
      CNYBRL: Number((baseRates.CNYBRL + baseRates.CNYBRL * cnyVariation).toFixed(4))
    });

    // Incrementa a data baseada no período
    switch (period) {
      case 'daily':
        currentDate = addDays(currentDate, 1);
        break;
      case 'weekly':
        currentDate = addWeeks(currentDate, 1);
        break;
      case 'monthly':
        currentDate = addMonths(currentDate, 1);
        break;
    }
  }

  return data;
}

export function useCurrencyData(
  startDate: Date | undefined,
  endDate: Date | undefined,
  period: Period
) {
  const data = useMemo(() => {
    if (!startDate || !endDate) {
      // Dados padrão dos últimos 30 dias
      const defaultEndDate = new Date();
      const defaultStartDate = addDays(defaultEndDate, -30);
      return generateMockData(defaultStartDate, defaultEndDate, 'daily');
    }

    return generateMockData(startDate, endDate, period);
  }, [startDate, endDate, period]);

  return data;
}