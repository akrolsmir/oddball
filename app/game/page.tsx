import { MarketScreen } from './MarketScreen'

export type Market = {
  id: string
  question: string
  url: string
  outcomeType: string
  probability: number
  volume: number
}

async function getMarkets() {
  const res = await fetch('https://manifold.markets/api/v0/markets?limit=500')

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return (await res.json()) as Market[]
}

// Return a shuffled copy of the array using the Fisher-Yates shuffle algorithm
function shuffle<T>(array: T[]) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const x = copy[i]
    copy[i] = copy[j]
    copy[j] = x
  }
  return copy
}

export default async function Game() {
  const markets = await getMarkets()
  const binaryMarkets = markets
    .filter((market) => market.outcomeType === 'BINARY')
    .filter((market) => market.volume > 100)
  const market = shuffle(binaryMarkets)[0]
  return (
    <div className="p-4 max-w-md mx-auto">
      {/* <h1 className="text-2xl font-bold">Markets</h1> */}
      <div className="mt-4">
        <MarketScreen key={market.id} market={market} />
      </div>
    </div>
  )
}
