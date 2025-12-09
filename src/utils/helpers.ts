import { faker } from '@faker-js/faker'

export interface StockData {
  symbol: string
  companyName: string
  price: number
  change: number
  changePercent: number
  high52Week: number
  low52Week: number
  sector: string
  industry: string
}

const SECTORS = [
  'Technology',
  'Healthcare',
  'Financial Services',
  'Consumer Cyclical',
  'Industrials',
  'Energy',
  'Telecommunications',
  'Consumer Defensive',
  'Real Estate',
  'Utilities',
]

const INDUSTRIES_BY_SECTOR: Record<string, Array<string>> = {
  Technology: ['Software', 'Semiconductors', 'Hardware', 'IT Services'],
  Healthcare: [
    'Biotechnology',
    'Pharmaceuticals',
    'Medical Devices',
    'Healthcare Services',
  ],
  'Financial Services': [
    'Banks',
    'Insurance',
    'Asset Management',
    'Credit Services',
  ],
  'Consumer Cyclical': [
    'Auto Manufacturers',
    'Retail',
    'Travel & Leisure',
    'Restaurants',
  ],
  Industrials: ['Aerospace', 'Machinery', 'Construction', 'Transportation'],
  Energy: ['Oil & Gas', 'Renewable Energy', 'Coal', 'Utilities'],
  Telecommunications: [
    'Telecom Services',
    'Wireless',
    'Internet Services',
    'Cable',
  ],
  'Consumer Defensive': [
    'Food & Beverage',
    'Household Products',
    'Tobacco',
    'Discount Stores',
  ],
  'Real Estate': [
    'REITs',
    'Real Estate Services',
    'Development',
    'Diversified',
  ],
  Utilities: ['Electric', 'Water', 'Gas', 'Renewable Utilities'],
}

export function createStocksData(count: number = 10): Array<StockData> {
  return Array.from({ length: count }, () => {
    const companyName = faker.company.name()
    const symbol = generateStockSymbol(companyName)
    const price = faker.number.float({ min: 5, max: 500, fractionDigits: 2 })
    const change = faker.number.float({ min: -15, max: 15, fractionDigits: 2 })
    const changePercent = (change / price) * 100
    const sector = faker.helpers.arrayElement(SECTORS)
    const industry = faker.helpers.arrayElement(INDUSTRIES_BY_SECTOR[sector])

    // 52-week high/low relative to current price
    const high52Week = faker.number.float({
      min: price,
      max: price * 1.5,
      fractionDigits: 2,
    })
    const low52Week = faker.number.float({
      min: price * 0.5,
      max: price,
      fractionDigits: 2,
    })

    return {
      symbol,
      companyName,
      price,
      change,
      changePercent: parseFloat(changePercent.toFixed(2)),
      high52Week,
      low52Week,
      sector,
      industry,
    }
  })
}

function generateStockSymbol(companyName: string): string {
  // Take first letters of company name, remove common words
  const words = companyName
    .replace(/\b(Inc|LLC|Ltd|Corp|Corporation|Group|Company|Co)\b/gi, '')
    .trim()
    .split(' ')
    .filter((word) => word.length > 0)

  if (words.length === 1) {
    // Single word: take first 3-4 letters
    return words[0]
      .substring(0, faker.helpers.arrayElement([3, 4]))
      .toUpperCase()
  } else {
    // Multiple words: take first letter of each word (max 4 letters)
    return words
      .slice(0, 4)
      .map((word) => word[0])
      .join('')
      .toUpperCase()
  }
}
