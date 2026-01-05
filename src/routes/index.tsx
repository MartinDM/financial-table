import { useMemo, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { StocksProvider, useStocks } from '../contexts/StocksContext'
import type { GridApi } from 'ag-grid-community'
import { Button } from '@/components/ui/button'

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

  const [selectedSectors, setSelectedSectors] = useState<Array<string>>([])
  const [selectedIndustries, setSelectedIndustries] = useState<Array<string>>(
    [],
  )
  const [filterMode, setFilterMode] = useState<'AND' | 'OR'>('OR')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const sectorNames = useMemo(
    () => Array.from(new Set(rowData.map((stock) => stock.sector))).sort(),
    [rowData],
  )

  const industryNames = useMemo(
    () => Array.from(new Set(rowData.map((stock) => stock.industry))).sort(),
    [rowData],
  )

  // Filter data based on AND/OR logic
  const filteredRowData = useMemo(() => {
    if (selectedSectors.length === 0 && selectedIndustries.length === 0) {
      return rowData
    }

    return rowData.filter((stock) => {
      const matchesSector =
        selectedSectors.length === 0 || selectedSectors.includes(stock.sector)
      const matchesIndustry =
        selectedIndustries.length === 0 ||
        selectedIndustries.includes(stock.industry)

      if (filterMode === 'OR') {
        // OR logic: show row if it matches ANY selected filter
        return matchesSector || matchesIndustry
      } else {
        // AND logic: show row only if it matches ALL selected filters
        return matchesSector && matchesIndustry
      }
    })
  }, [rowData, selectedSectors, selectedIndustries, filterMode])

  const toggleSector = (sector: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sector)
        ? prev.filter((s) => s !== sector)
        : [...prev, sector],
    )
  }

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry],
    )
  }

  const clearFilters = () => {
    setSelectedSectors([])
    setSelectedIndustries([])
  }

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
      navigator.clipboard.writeText(String(value))
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

      {/* Filter Controls */}
      <div className="mb-4 bg-slate-100 rounded-lg">
        {/* Collapsible Header */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-200 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              Filters
              {(selectedSectors.length > 0 ||
                selectedIndustries.length > 0) && (
                <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {selectedSectors.length + selectedIndustries.length}
                </span>
              )}
            </span>
          </div>
          <span className="text-gray-500 text-sm">
            {isFilterOpen ? '▲' : '▼'}
          </span>
        </button>

        {/* Collapsible Content */}
        {isFilterOpen && (
          <div className="px-4 pb-4 pt-2">
            {/* AND/OR Toggle */}
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm font-medium">Filter Mode:</span>
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  onClick={() => setFilterMode('OR')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg border transition-colors ${
                    filterMode === 'OR'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  OR
                </button>
                <button
                  onClick={() => setFilterMode('AND')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg border-t border-r border-b transition-colors ${
                    filterMode === 'AND'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  AND
                </button>
              </div>
              <span className="text-xs text-gray-500 ml-2">
                {filterMode === 'OR'
                  ? 'Show stocks matching ANY filter'
                  : 'Show stocks matching ALL filters'}
              </span>
            </div>

            <div className="flex gap-4 items-start">
              {/* Sector Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Sector</label>
                <div className="flex gap-2 items-start">
                  <select
                    className="px-3 py-2 border rounded-md text-sm bg-white"
                    value=""
                    onChange={(e) => {
                      if (
                        e.target.value &&
                        !selectedSectors.includes(e.target.value)
                      ) {
                        setSelectedSectors([...selectedSectors, e.target.value])
                      }
                    }}
                  >
                    <option value="">Select sector...</option>
                    {sectorNames.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {selectedSectors.map((sector) => (
                      <span
                        key={sector}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm bg-blue-600 text-white"
                      >
                        {sector}
                        <button
                          onClick={() => toggleSector(sector)}
                          className="hover:bg-blue-700 rounded-full p-0.5"
                          aria-label="Remove"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Industry Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  Industry
                </label>
                <div className="flex gap-2 items-start">
                  <select
                    className="px-3 py-2 border rounded-md text-sm bg-white"
                    value=""
                    onChange={(e) => {
                      if (
                        e.target.value &&
                        !selectedIndustries.includes(e.target.value)
                      ) {
                        setSelectedIndustries([
                          ...selectedIndustries,
                          e.target.value,
                        ])
                      }
                    }}
                  >
                    <option value="">Select industry...</option>
                    {industryNames.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {selectedIndustries.map((industry) => (
                      <span
                        key={industry}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm bg-green-600 text-white"
                      >
                        {industry}
                        <button
                          onClick={() => toggleIndustry(industry)}
                          className="hover:bg-green-700 rounded-full p-0.5"
                          aria-label="Remove"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  disabled={
                    selectedSectors.length === 0 &&
                    selectedIndustries.length === 0
                  }
                >
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Active Filter Summary */}
            {(selectedSectors.length > 0 || selectedIndustries.length > 0) && (
              <div className="mt-3 text-sm text-gray-600">
                Showing {filteredRowData.length} of {rowData.length} stocks
                {selectedSectors.length > 0 && (
                  <span className="ml-2">
                    • Sectors: {selectedSectors.join(', ')}
                  </span>
                )}
                {selectedIndustries.length > 0 && (
                  <span className="ml-2">
                    • Industries: {selectedIndustries.join(', ')}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ height: 600, width: '100%' }} className="ag-theme-alpine">
        <AgGridReact
          onGridReady={onGridReady}
          rowData={filteredRowData}
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
