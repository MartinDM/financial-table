import { createFileRoute } from '@tanstack/react-router'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { StocksProvider, useStocks } from '../contexts/StocksContext'

ModuleRegistry.registerModules([AllCommunityModule])

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <StocksProvider>
      <StocksGrid />
    </StocksProvider>
  )
}

function StocksGrid() {
  // can useStocks because app is wrapped in StocksProvider
  const { rowData, colDefs, isLoading } = useStocks()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading stocks...</div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Financial Stocks Table</h1>
      <div style={{ height: 600, width: '100%' }} className="ag-theme-alpine">
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
      </div>
    </div>
  )
}
