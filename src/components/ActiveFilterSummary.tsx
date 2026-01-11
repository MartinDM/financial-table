interface ActiveFilterSummaryProps {
  filteredCount: number
  totalCount: number
  selectedSectors: Array<string>
  selectedIndustries: Array<string>
  symbolFilterValue: string
  symbolFilter: string
  symbolFilterOptions: Record<string, string>
}

export function ActiveFilterSummary({
  filteredCount,
  totalCount,
  selectedSectors,
  selectedIndustries,
  symbolFilterValue,
  symbolFilter,
  symbolFilterOptions,
}: ActiveFilterSummaryProps) {
  if (selectedSectors.length === 0 && selectedIndustries.length === 0) {
    return null
  }

  return (
    <div className="mt-3 text-sm text-gray-600">
      Showing {filteredCount} of {totalCount} stocks
      {selectedSectors.length > 0 && (
        <span className="ml-2">• Sectors: {selectedSectors.join(', ')}</span>
      )}
      {selectedIndustries.length > 0 && (
        <span className="ml-2">
          • Industries: {selectedIndustries.join(', ')}
        </span>
      )}
      {symbolFilterValue && (
        <span className="ml-2">
          • Symbol Filter: {symbolFilterOptions[symbolFilter]} "
          {symbolFilterValue}"
        </span>
      )}
    </div>
  )
}
