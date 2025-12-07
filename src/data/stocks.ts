import { createStocksData } from '@/utils/helpers'

export async function getStocks(): Promise<Array<any>> {
  return await createStocksData(50)
  // Later, refactor to use real API in services/stocksApi.ts
}
