import { MarketScreen, RandomMarket } from './MarketScreen'

export type Market = {
  id: string
  question: string
  url: string
  outcomeType: string
  probability: number
  volume: number
}
export async function marketsFromApi(url: string) {
  const res = await fetch(url, {
    next: { revalidate: 60 },
  })

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return (await res.json()) as Market[]
}

const SHOWCASE_URL =
  'https://manifold.markets/api/v0/group/by-id/i23ZaDrc8EYPf2Q2FNW4/markets'

export default async function Game() {
  const markets = await marketsFromApi(SHOWCASE_URL)
  const binaryMarkets = markets
    .filter((market) => market.outcomeType === 'BINARY')
    .filter((market) => market.volume > 100)
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-6 text-center">🎱ddball</h1>
      <RandomMarket markets={binaryMarkets} />
    </div>
  )
}
