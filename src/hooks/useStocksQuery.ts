import { useQuery } from '@tanstack/react-query'
import { getStocks } from '@/data/stocks'

export function useStocksQuery() {
  return useQuery({
    queryKey: ['stocks'],
    queryFn: getStocks,
  })
}
