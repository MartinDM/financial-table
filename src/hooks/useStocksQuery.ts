import { useQuery } from '@tanstack/react-query'
import { getStocks } from '@/data/stocks'

export function useStocksQuery() {
  return useQuery({
    queryKey: ['stocks'],
    queryFn: async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return getStocks()
    },
  })
}
