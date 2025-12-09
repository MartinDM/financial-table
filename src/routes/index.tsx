import { useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { StocksProvider, useStocks } from '../contexts/StocksContext'
import type { GridApi } from 'ag-grid-community'

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
  const gridApiRef = useRef<GridApi | null>(null)
  const [disableSelections, setDisableSelections] = useState(false)

  const onGridReady = (params: any) => {
    gridApiRef.current = params.api

    // Log pinned columns directly here if needed
    const allColumns = params.api.getColumns()
    const pinnedColumns = allColumns?.filter((col: any) => col.isPinned())
    if (pinnedColumns && pinnedColumns.length > 0) {
      pinnedColumns.forEach((col: any) => {
        console.log(
          'Pinned column:',
          col.getColDef().headerName || col.getColId(),
        )
      })
    }
  }

  const onSelectionChanged = () => {
    if (!gridApiRef.current) return
    const selectedRows = gridApiRef.current.getSelectedRows()

    if (selectedRows.length >= 3) {
      setDisableSelections(true)
    } else {
      setDisableSelections(false)
    }

    console.log('Selected rows:', selectedRows)
    console.log('Number of selected rows:', selectedRows.length)
  }

  const isRowSelectable = (node: any) => {
    // Prevent selection if already at limit and this row is not already selected
    if (disableSelections && !node.isSelected()) {
      return false
    }
    return true
  }

  const onCellContextMenu = (event: any) => {
    event.event.preventDefault() // Prevent default context menu
    const value = event.value || event.data?.[event.column.getColId()]

    if (value) {
      navigator.clipboard.writeText(String(value)).then(() => {
        console.log('Copied to clipboard:', value)
      })
    }
  }

  const onCellClicked = (event: any) => {
    const value = event.value || event.data?.[event.column.getColId()]

    if (value) {
      navigator.clipboard.writeText(String(value)).then(() => {
        alert(`Copied to clipboard: ${value}`)
      })
    }
  }

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
        <AgGridReact
          onGridReady={onGridReady}
          rowData={rowData}
          columnDefs={colDefs}
          onCellClicked={onCellClicked}
          onCellContextMenu={onCellContextMenu}
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
          suppressRowClickSelection={true}
          isRowSelectable={isRowSelectable}
        />
      </div>
    </div>
  )
}
