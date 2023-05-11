import { MarketScreen, RandomMarket } from './MarketScreen'

export type Market = {
  id: string
  question: string
  url: string
  outcomeType: string
  probability: number
  volume: number
}

async function getMarkets() {
  const res = await fetch('https://manifold.markets/api/v0/markets?limit=500', {
    next: { revalidate: 60 },
  })

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return (await res.json()) as Market[]
}

export default async function Game() {
  const markets = await getMarkets()
  const binaryMarkets = markets
    .filter((market) => market.outcomeType === 'BINARY')
    .filter((market) => market.volume > 100)
  return (
    <div className="p-4 max-w-md mx-auto">
      {/* <h1 className="text-2xl font-bold">Markets</h1> */}
      <RandomMarket markets={binaryMarkets} />
    </div>
  )
}
