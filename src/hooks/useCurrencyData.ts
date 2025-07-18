import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Period } from '@/components/PeriodSelector';

interface CurrencyData {
  date: string;
  USDBRL: number;
  EURBRL: number;
  CNYBRL: number;
}

// Função para buscar cotação do BCB
async function fetchBCBRate(currency: string, date: string): Promise<number | null> {
  try {
    const formattedDate = format(parseISO(date), 'MM-dd-yyyy');
    let endpoint = '';
    
    switch (currency) {
      case 'USD':
        endpoint = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${formattedDate}'&$top=1&$format=json&$select=cotacaoVenda`;
        break;
      case 'EUR':
        endpoint = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='EUR'&@dataCotacao='${formattedDate}'&$top=1&$format=json&$select=cotacaoVenda`;
        break;
      case 'CNY':
        endpoint = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='CNY'&@dataCotacao='${formattedDate}'&$top=1&$format=json&$select=cotacaoVenda`;
        break;
      default:
        return null;
    }

    const response = await fetch(endpoint);
    const data = await response.json();
    
    if (data.value && data.value.length > 0) {
      return data.value[0].cotacaoVenda;
    }
    return null;
  } catch (error) {
    console.error(`Erro ao buscar cotação ${currency}:`, error);
    return null;
  }
}

// Função para buscar dados de múltiplas datas
async function fetchCurrencyData(startDate: Date, endDate: Date, period: Period): Promise<CurrencyData[]> {
  const data: CurrencyData[] = [];
  const currencies = ['USD', 'EUR', 'CNY'];
  
  // Gera array de datas baseado no período
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    
    switch (period) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
    }
  }

  // Busca dados para cada data
  for (const date of dates) {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayData: any = { date: dateStr };
    
    // Busca cotação para cada moeda
    for (const currency of currencies) {
      const rate = await fetchBCBRate(currency, dateStr);
      if (rate !== null) {
        dayData[`${currency}BRL`] = rate;
      } else {
        // Fallback: usa última cotação válida ou valor padrão
        const lastValidRate = data.length > 0 ? data[data.length - 1][`${currency}BRL` as keyof CurrencyData] : 
          (currency === 'USD' ? 5.2 : currency === 'EUR' ? 5.8 : 0.73);
        dayData[`${currency}BRL`] = lastValidRate;
      }
    }
    
    data.push(dayData);
  }

  return data;
}

export function useCurrencyData(
  startDate: Date | undefined,
  endDate: Date | undefined,
  period: Period
) {
  const [data, setData] = useState<CurrencyData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const effectiveStartDate = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const effectiveEndDate = endDate || new Date();
      
      try {
        const currencyData = await fetchCurrencyData(effectiveStartDate, effectiveEndDate, period);
        setData(currencyData);
      } catch (error) {
        console.error('Erro ao buscar dados de cotação:', error);
        // Fallback para dados mock em caso de erro
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, period]);

  return { data, loading };
}