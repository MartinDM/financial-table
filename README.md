# Financial Table

A modern financial stocks table application built with React, showcasing real-time stock data in an interactive grid.

## Tech Stack

- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vitejs.dev/)** - Lightning-fast build tool and dev server
- **[AG Grid](https://www.ag-grid.com/)** - Enterprise-grade data grid with sorting, filtering, and selection
- **[TanStack Query](https://tanstack.com/query)** - Server state management and data fetching
- **[TanStack Router](https://tanstack.com/router)** - Type-safe file-based routing
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Faker.js](https://fakerjs.dev/)** - Mock financial data generation

## Features

- 📊 Interactive stock table with sorting and filtering
- ☑️ Row selection with checkbox support (up to 3 rows)
- 💰 Real-time price updates with color-coded changes
- 🎨 Formatted currency display and percentage changes
- 📋 Right-click to copy cell values to clipboard
- 🔄 Data fetching with React Query
- 📱 Responsive design with Tailwind CSS
- 🧪 Mock data generation for development

## Getting Started

```bash
npm install
npm run dev
```

## Building For Production

```bash
npm run build
```

## Architecture

### Stocks Context

The application uses a centralized `StocksContext` that provides:

- **`rowData`** - Array of stock data for AG Grid
- **`colDefs`** - Column definitions with formatters for financial data
- **`isLoading`** - Loading state management
- **`error`** - Error handling
- **`refresh()`** - Manual data refresh function

All stock data flows through this context, making it easy to access from any component in the application.

### Data Flow

1. `useStocksQuery` hook fetches mock stock data using Faker.js
2. Data is managed by TanStack Query for caching and refetching
3. `StocksContext` provides the data to child components
4. AG Grid consumes `rowData` and `colDefs` from context
5. UI updates automatically when data changes

### TanStack Query Integration

The application uses TanStack Query for data fetching with a custom hook pattern:

**1. Query Hook (`src/hooks/useStocksQuery.ts`)**
```typescript
export function useStocksQuery() {
  return useQuery({
    queryKey: ['stocks'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulated delay
      return getStocks()
    },
  })
}
```

**2. Context Provider (`src/contexts/StocksContext.tsx`)**
```typescript
export function StocksProvider({ children }: { children: ReactNode }) {
  const { data: queryData, isLoading, error } = useStocksQuery()
  const [stocks, setStocks] = useState<StockData[]>(queryData || [])
  
  useEffect(() => {
    if (queryData) setStocks(queryData)
  }, [queryData])
  
  // ... provides rowData, colDefs, isLoading, error, refresh
}
```

**3. Component Usage**
```typescript
function StocksGrid() {
  const { rowData, colDefs, isLoading } = useStocks()
  
  if (isLoading) return <div>Loading...</div>
  
  return <AgGridReact rowData={rowData} columnDefs={colDefs} />
}
```

This pattern provides:
- **Automatic caching** - Data is cached by TanStack Query
- **Loading states** - Built-in loading and error handling
- **Easy refetching** - Call `refresh()` to invalidate and refetch
- **Centralized data** - All components access the same data through context

## Testing

This project uses [Vitest](https://vitest.dev/) for testing:

```bash
npm run test
```

## Linting & Formatting

```bash
npm run lint
npm run format
npm run check
```
