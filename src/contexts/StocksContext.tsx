import { createContext, useContext, useEffect, useMemo, useState } from 'react'
// import useMutation from react-query
import { useQueryClient } from '@tanstack/react-query'
import { useStocksQuery } from '../hooks/useStocksQuery'
import type { ReactNode } from 'react'
import type { StockData } from '../utils/helpers'
import type { ColDef } from 'ag-grid-community'

type StocksContextType = {
  stocks: Array<StockData>
  rowData: Array<StockData>
  colDefs: Array<ColDef>
  isLoading: boolean
  error: Error | null
  refresh: () => void
}

const StocksContext = createContext<StocksContextType | undefined>(undefined)

export function StocksProvider({ children }: { children: ReactNode }) {
  const { data: queryData, isLoading, error } = useStocksQuery()
  const [stocks, setStocks] = useState<Array<StockData>>(queryData || [])
  const queryClient = useQueryClient()

  useEffect(() => {
    if (queryData) setStocks(queryData)
  }, [queryData])

  const colDefs = useMemo<Array<ColDef>>(() => {
    const columns: Array<ColDef> = [
      {
        field: 'checkbox',
        headerName: ' ',
        checkboxSelection: true,
        headerCheckboxSelection: false,
        showDisabledCheckboxes: true,
        width: 50,
        pinned: 'left',
        suppressMovable: true,
        lockPosition: true,
      },
      {
        field: 'symbol',
        headerName: 'Symbol',
        filter: true,
        sortable: true,
      },
      {
        field: 'companyName',
        headerName: 'Company',
        filter: true,
        editable: true,
        sortable: true,
      },
      {
        field: 'price',
        headerName: 'Price',
        sortable: true,
        valueFormatter: (params) => `$${params.value?.toFixed(2) || '0.00'}`,
      },
      {
        field: 'change',
        headerName: 'Change',
        sortable: true,
        cellStyle: (params) => ({
          color: params.value >= 0 ? 'green' : 'red',
        }),
        valueFormatter: (params) =>
          `${params.value >= 0 ? '+' : ''}${params.value?.toFixed(2) || '0.00'}`,
      },
      {
        field: 'changePercent',
        headerName: 'Change %',
        sortable: true,
        cellStyle: (params) => ({
          color: params.value >= 0 ? 'green' : 'red',
        }),
        valueFormatter: (params) =>
          `${params.value >= 0 ? '+' : ''}${params.value?.toFixed(2) || '0.00'}%`,
      },
      {
        field: 'high52Week',
        headerName: '52W High',
        sortable: true,
        valueFormatter: (params) => `$${params.value?.toFixed(2) || '0.00'}`,
      },
      {
        field: 'low52Week',
        headerName: '52W Low',
        sortable: true,
        valueFormatter: (params) => `$${params.value?.toFixed(2) || '0.00'}`,
      },
      { field: 'sector', headerName: 'Sector', filter: true, sortable: true },
      {
        field: 'industry',
        headerName: 'Industry',
        filter: true,
        sortable: true,
      },
    ]

    return columns
  }, [])

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['stocks'] })
  }

  const value: StocksContextType = {
    stocks,
    rowData: stocks,
    colDefs,
    isLoading,
    error,
    refresh,
  }

  return (
    <StocksContext.Provider value={value}>{children}</StocksContext.Provider>
  )
}

export function useStocks() {
  const ctx = useContext(StocksContext)
  if (!ctx) throw new Error('useStocks must be used within a StocksProvider')
  return ctx
}
