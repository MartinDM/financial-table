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
    staleTime: 1000 * 60 * 5, // 5 minutes - data is considered fresh for this duration
  })
}
